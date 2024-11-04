import vine from '@vinejs/vine';

export const TransactionCreateSchema = vine.object({
	title: vine.string().trim(),
	amount: vine.number(),
	type: vine.enum(['credit', 'debit']),
	session_id: vine.string().optional(),
});

export const TransactionCreateValidator = vine.compile(TransactionCreateSchema);
