import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { appRoutes } from './app.routes';
import { ConflictError } from './shared/infra/errors/conflict-error';
import { NotFoundError } from './shared/infra/errors/not-found-error';
import { UnauthorizedError } from './shared/infra/errors/unauthorized-error';

const port = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  .use(swagger())
  .error({ ConflictError, NotFoundError, UnauthorizedError })
  .onError(({ code, error, set }) => {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor.';

    if (code === 'ConflictError') {
      set.status = 409;
      return { error: 'failed' as const, message };
    }
    if (code === 'NotFoundError') {
      set.status = 404;
      return { error: 'failed' as const, message };
    }
    if (code === 'UnauthorizedError') {
      set.status = 401;
      return { error: 'failed' as const, message };
    }
    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: 'failed' as const, message };
    }

    set.status = 500;
    return { error: 'failed' as const, message };
  })
  .use(appRoutes)
  .listen(port);

console.log(`🔊 ... Listening: http://localhost:${app.server?.port}`);
console.log(`📃 ... Docs: http://localhost:${app.server?.port}/docs`);

export type App = typeof app;
