import { NotFoundError } from '@/shared/infra/errors/not-found-error';
import { t, type Static } from 'elysia';
import { UserRepository, type UserPublic } from '../infra/user.repository';

export const getUserByEmailInput = t.Object({
  email: t.String({ format: 'email', maxLength: 255 }),
});

type GetUserByEmailInput = Static<typeof getUserByEmailInput>;

export async function getUserByEmailUseCase({
  email,
}: GetUserByEmailInput): Promise<UserPublic> {
  const user = await UserRepository.findByEmail({ email });

  if (!user) throw new NotFoundError('Usuário não encontrado.');

  return user;
}
