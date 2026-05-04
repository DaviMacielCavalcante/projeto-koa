import { ConflictError } from '@/shared/infra/errors/conflict-error';
import { NotFoundError } from '@/shared/infra/errors/not-found-error';
import { t, type Static } from 'elysia';
import { userPlanValues } from '../domain/user.types';
import { UserRepository, type UserPublic } from '../infra/user.repository';

export const updateUserInput = t.Object({
  id: t.String({ minLength: 1 }),
  name: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  email: t.Optional(t.String({ format: 'email', maxLength: 255 })),
  password: t.Optional(t.String({ minLength: 8, maxLength: 128 })),
  phone: t.Optional(t.String({ minLength: 1, maxLength: 20 })),
  municipality: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  plan: t.Optional(t.Enum(userPlanValues)),
});

type UpdateUserInput = Static<typeof updateUserInput>;

export async function updateUserUseCase({
  id,
  password,
  ...rest
}: UpdateUserInput): Promise<UserPublic> {
  const existing = await UserRepository.findById({ id });

  if (!existing) throw new NotFoundError('Usuário não encontrado.');

  if (rest.email && rest.email !== existing.email) {
    const emailOwner = await UserRepository.findByEmail({ email: rest.email });
    if (emailOwner && emailOwner.id !== id) {
      throw new ConflictError('Já existe um usuário com este email.');
    }
  }

  const password_hash = password
    ? await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 })
    : undefined;

  const updated = await UserRepository.update(id, {
    ...rest,
    ...(password_hash ? { password_hash } : {}),
  });

  if (!updated) throw new NotFoundError('Usuário não encontrado.');

  return updated;
}
