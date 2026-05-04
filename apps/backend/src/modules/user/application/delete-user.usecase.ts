import { NotFoundError } from '@/shared/infra/errors/not-found-error';
import { t, type Static } from 'elysia';
import { UserRepository } from '../infra/user.repository';

export const deleteUserInput = t.Object({
  id: t.String({ minLength: 1 }),
});

type DeleteUserInput = Static<typeof deleteUserInput>;

export async function deleteUserUseCase({ id }: DeleteUserInput): Promise<void> {
  const existing = await UserRepository.findById({ id });

  if (!existing) throw new NotFoundError('Usuário não encontrado.');

  await UserRepository.delete(id);
}
