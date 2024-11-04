import type { Knex } from 'knex';
import { knex as KnexSetup } from 'knex';

import { Env } from '@start/env';

export const KnexConfig: Knex.Config = {
	client: Env.DATABASE_CLIENT,
	connection:
		Env.DATABASE_CLIENT === 'sqlite'
			? {
					filename: Env.DATABASE_URL,
				}
			: Env.DATABASE_URL,
	useNullAsDefault: true,
	migrations: {
		extension: 'ts',
		directory: './database/migrations',
	},
	seeds: {
		directory: './database/seeders',
		extension: 'ts',
	},
};

export const knex = KnexSetup(KnexConfig);
