import type { FastifyReply, FastifyRequest } from 'fastify';

import { TransactionCookieValidator } from '@validators/transaction/base.validator';

export async function TransactionCheckSessionIdExist(
	request: FastifyRequest,
	response: FastifyReply,
): Promise<void> {
	const { sessionId } = await TransactionCookieValidator.validate(
		request.cookies,
	);

	if (!sessionId) {
		return response
			.status(401)
			.send({ error: 'Unauthorized', cause: 'No sessionId', code: 401 });
	}
}
