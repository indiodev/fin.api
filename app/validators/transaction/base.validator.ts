import vine from '@vinejs/vine';

export const TransactionParamSchema = vine.object({
	id: vine.string().uuid(),
});

export const TransactionCookieSchema = vine.object({
	sessionId: vine.string().uuid().optional(),
});

export const TransactionParamValidator = vine.compile(TransactionParamSchema);
export const TransactionCookieValidator = vine.compile(TransactionCookieSchema);
