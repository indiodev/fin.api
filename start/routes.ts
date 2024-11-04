import { Router } from '@routes/index';

import { kernel } from './kernel';

kernel.register(Router.Transaction, { prefix: 'transactions' });

export { kernel as app };
