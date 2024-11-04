import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('transactions', (table) => {
		table.uuid('id').primary().defaultTo(knex.fn.uuid());
		table.string('title').notNullable();
		table.decimal('amount', 10, 2).notNullable();
		table.enum('type', ['credit', 'debit']).notNullable();
		table.uuid('session_id').nullable().index();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('transactions');
}
