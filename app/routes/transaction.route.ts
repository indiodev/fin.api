import { randomUUID } from 'crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { knex } from '@config/database';
import { TransactionCheckSessionIdExist } from '@middlewares/transaction/check-session-id-exist.middleware';
import {
	TransactionCookieValidator,
	TransactionParamValidator,
} from '@validators/transaction/base.validator';
import { TransactionCreateValidator } from '@validators/transaction/create.validator';

async function Create(
	request: FastifyRequest,
	response: FastifyReply,
): Promise<void> {
	const payload = await TransactionCreateValidator.validate(request.body);

	let { sessionId } = await TransactionCookieValidator.validate(
		request.cookies,
	);

	if (!sessionId) {
		sessionId = randomUUID();
		response.cookie('sessionId', sessionId, {
			path: '/',
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		});
	}

	await knex('transactions').insert({
		...payload,
		...(payload.type === 'debit' && {
			amount: payload.amount * -1,
		}),
		session_id: sessionId,
	});

	return response.status(201).send();
}

async function List(
	request: FastifyRequest,
	response: FastifyReply,
): Promise<void> {
	const sessionId = request.cookies.sessionId;
	const data = await knex('transactions')
		.select('*')
		.where('session_id', sessionId);

	return response.status(200).send({ data });
}

async function FindById(
	request: FastifyRequest,
	response: FastifyReply,
): Promise<void> {
	const sessionId = request.cookies.sessionId;
	const params = await TransactionParamValidator.validate(request.params);
	const transaction = await knex('transactions')
		.where('id', params.id)
		.andWhere('session_id', sessionId)
		.first();

	if (!transaction) {
		return response.status(404).send({
			error: 'Transaction not found',
			code: 404,
			cause: 'Transaction not found',
		});
	}

	return response.status(200).send({ transaction });
}

async function Summary(
	request: FastifyRequest,
	response: FastifyReply,
): Promise<void> {
	const sessionId = request.cookies.sessionId;
	const summary = await knex('transactions')
		.sum('amount', { as: 'amount' })
		.where('session_id', sessionId)
		.first();

	return response.status(200).send({ summary });
}

export async function Transaction(context: FastifyInstance): Promise<void> {
	context.addHook('preHandler', async (request): Promise<void> => {
		console.log(`${request.method} ${request.url}`);
	});
	context.post('/', Create);
	context.get(
		'/',
		{
			preHandler: [TransactionCheckSessionIdExist],
		},
		List,
	);
	context.get(
		'/:id',
		{
			preHandler: [TransactionCheckSessionIdExist],
		},
		FindById,
	);
	context.get(
		'/summary',
		{
			preHandler: [TransactionCheckSessionIdExist],
		},
		Summary,
	);
}
