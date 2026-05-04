import { Elysia } from 'elysia';
import { UserController } from './modules/user/infra/user.controller';

export const appRoutes = new Elysia({ prefix: '/v1' })
    .use(UserController);
