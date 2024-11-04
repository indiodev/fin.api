import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
	config({ path: '.env.test' });
} else {
	config();
}

const Schema = z.object({
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	DATABASE_URL: z.string(),
	DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
	PORT: z.coerce.number().default(3333),
});

export const parse = Schema.safeParse(process.env);

if (parse.success === false) {
	console.error('Invalid environment variables', parse.error.format());
	throw new Error('Invalid environment variables');
}

export const Env = parse.data;
