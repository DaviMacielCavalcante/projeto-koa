import { NotFoundError } from '@/shared/infra/errors/not-found-error';
import { t, type Static } from 'elysia';
import { UserRepository, type UserPublic } from '../infra/user.repository';

export const getUserInput = t.Object({
  id: t.String({ minLength: 1, error: 'O id do usuário é obrigatório.' }),
});

type GetUserInput = Static<typeof getUserInput>;

export async function getUserUseCase({ id }: GetUserInput): Promise<UserPublic> {
  const user = await UserRepository.findById({ id });

  if (!user) throw new NotFoundError('Usuário não encontrado.');

  return user;
}
