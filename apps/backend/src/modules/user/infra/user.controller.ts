import { createController } from '@/shared/infra/base.controller';
import { t } from 'elysia';
import {
  createUserInput,
  createUserOutput,
  createUserUseCase,
} from '../application/create-user.usecase';
import { deleteUserInput, deleteUserUseCase } from '../application/delete-user.usecase';
import {
  getUserByEmailInput,
  getUserByEmailUseCase,
} from '../application/get-user-by-email.usecase';
import { getUserInput, getUserUseCase } from '../application/get-user.usecase';
import {
  listUsersInput,
  listUsersOutput,
  listUsersUseCase,
} from '../application/list-users.usecase';
import { updateUserInput, updateUserUseCase } from '../application/update-user.usecase';
import { UserPublicType } from '../domain/user.types';

const errorResponse = t.Object({
  error: t.Literal('failed'),
  message: t.String(),
});

export const UserController = createController({ prefix: '/users', tags: ['Users'] })
  // POST /users — público
  .post(
    '/',
    async ({ body, set }) => {
      const result = await createUserUseCase(body);
      set.status = 201;
      return result;
    },
    {
      body: createUserInput,
      response: {
        201: createUserOutput,
        409: errorResponse,
        500: errorResponse,
      },
      detail: {
        tags: ['Users'],
        summary: 'Cadastrar novo usuário',
        description: 'Endpoint público de cadastro. A senha é hasheada com bcrypt antes de persistir.',
      },
    },
  )

  // GET /users — protegido
  .get(
    '/',
    async ({ query, request, validateToken, set }) => {
      await validateToken(request);
      const result = await listUsersUseCase(query);
      set.status = 200;
      return result;
    },
    {
      query: listUsersInput,
      response: {
        200: listUsersOutput,
        401: errorResponse,
        500: errorResponse,
      },
      detail: {
        tags: ['Users'],
        summary: 'Listar usuários',
        description: 'Lista paginada com filtros opcionais por nome (search) e plano.',
      },
    },
  )

  // GET /users/by-email/:email — protegido
  .get(
    '/by-email/:email',
    async ({ params, request, validateToken, set }) => {
      await validateToken(request);
      const result = await getUserByEmailUseCase(params);
      set.status = 200;
      return result;
    },
    {
      params: getUserByEmailInput,
      response: {
        200: UserPublicType,
        401: errorResponse,
        404: errorResponse,
        500: errorResponse,
      },
      detail: {
        tags: ['Users'],
        summary: 'Buscar usuário por email',
      },
    },
  )

  // GET /users/:id — protegido
  .get(
    '/:id',
    async ({ params, request, validateToken, set }) => {
      await validateToken(request);
      const result = await getUserUseCase(params);
      set.status = 200;
      return result;
    },
    {
      params: getUserInput,
      response: {
        200: UserPublicType,
        401: errorResponse,
        404: errorResponse,
        500: errorResponse,
      },
      detail: {
        tags: ['Users'],
        summary: 'Buscar usuário por id',
      },
    },
  )

  // PATCH /users/:id — protegido
  .patch(
    '/:id',
    async ({ params, body, request, validateToken, set }) => {
      await validateToken(request);
      const result = await updateUserUseCase({ id: params.id, ...body });
      set.status = 200;
      return result;
    },
    {
      params: t.Object({ id: t.String({ minLength: 1 }) }),
      body: t.Partial(t.Omit(updateUserInput, ['id'])),
      response: {
        200: UserPublicType,
        401: errorResponse,
        404: errorResponse,
        409: errorResponse,
        500: errorResponse,
      },
      detail: {
        tags: ['Users'],
        summary: 'Atualizar usuário',
        description: 'Atualização parcial. Se "password" vier, é re-hasheada com bcrypt.',
      },
    },
  )

  // DELETE /users/:id — protegido
  .delete(
    '/:id',
    async ({ params, request, validateToken, set }) => {
      await validateToken(request);
      await deleteUserUseCase(params);
      set.status = 200;
      return { message: 'Usuário deletado com sucesso.' };
    },
    {
      params: deleteUserInput,
      response: {
        200: t.Object({ message: t.String() }),
        401: errorResponse,
        404: errorResponse,
        500: errorResponse,
      },
      detail: {
        tags: ['Users'],
        summary: 'Deletar usuário',
      },
    },
  );
