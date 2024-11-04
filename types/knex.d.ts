import 'knex';

declare module 'knex/types/tables' {
	export interface Tables {
		transactions: {
			id: string;
			title: string;
			amount: number;
			type: 'credit' | 'debit';
			created_at: string;
			session_id?: string;
		};
	}
}
