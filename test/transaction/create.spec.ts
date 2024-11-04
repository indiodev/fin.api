import { execSync } from 'child_process';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '@start/routes';

describe('Transactions routes', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		execSync('npm run knex migrate:rollback --all');
		execSync('npm run knex migrate:latest');
	});

	it('should be able to create  a new transaction', async () => {
		await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				type: 'credit',
				amount: 100,
			})
			.expect(201);
	});

	it('should be able to list all transactions', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				type: 'credit',
				amount: 100,
			});

		const cookies = createTransactionResponse.get('Set-Cookie');

		const listTransactionResponse = await request(app.server)
			.get('/transactions')
			.set('Cookie', cookies!)
			.expect(200);

		expect(listTransactionResponse.body.data).toEqual([
			expect.objectContaining({
				title: 'New transaction',
				amount: 100,
			}),
		]);
	});

	it('should be able to get a specific transaction', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				type: 'credit',
				amount: 100,
			});

		const cookies = createTransactionResponse.get('Set-Cookie');

		const listTransactionResponse = await request(app.server)
			.get('/transactions')
			.set('Cookie', cookies!)
			.expect(200);

		const transactionId = listTransactionResponse.body.data[0].id;

		const transaction = await request(app.server)
			.get(`/transactions/${transactionId}`)
			.set('Cookie', cookies!)
			.expect(200);

		expect(transaction.body.transaction).toEqual(
			expect.objectContaining({
				title: 'New transaction',
				amount: 100,
			}),
		);
	});

	it('should be able to get the summary', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Credit transaction',
				type: 'credit',
				amount: 300,
			});

		const cookies = createTransactionResponse.get('Set-Cookie');

		await request(app.server)
			.post('/transactions')
			.set('Cookie', cookies!)
			.send({
				title: 'Debit transaction',
				type: 'debit',
				amount: 100,
			});

		const summary = await request(app.server)
			.get('/transactions/summary')
			.set('Cookie', cookies!)
			.expect(200);

		expect(summary.body.summary).toEqual({
			amount: 200,
		});
	});
});
