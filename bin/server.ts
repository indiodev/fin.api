import { Env } from '@start/env';
import { app } from '@start/routes';

app.listen({ port: Env.PORT }).then(() => {
	console.log(`Server running on port ${Env.PORT}`);
});
