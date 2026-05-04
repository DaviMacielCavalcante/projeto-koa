import { ConflictError } from '@/shared/infra/errors/conflict-error';
import { t, type Static } from 'elysia';
import { UserPublicType, userPlanValues } from '../domain/user.types';
import { UserRepository } from '../infra/user.repository';

export const createUserInput = t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
  email: t.String({ format: 'email', maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 128 }),
  phone: t.String({ minLength: 1, maxLength: 20 }),
  municipality: t.String({ minLength: 1, maxLength: 255 }),
  plan: t.Optional(t.Enum(userPlanValues)),
});

export const createUserOutput = t.Object({
  user: UserPublicType,
});

type CreateUserInput = Static<typeof createUserInput>;
type CreateUserOutput = Static<typeof createUserOutput>;

export async function createUserUseCase(input: CreateUserInput): Promise<CreateUserOutput> {
  const existing = await UserRepository.findByEmail({ email: input.email });

  if (existing) {
    throw new ConflictError('Já existe um usuário com este email.');
  }

  const password_hash = await Bun.password.hash(input.password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  const user = await UserRepository.create({
    name: input.name,
    email: input.email,
    password_hash,
    phone: input.phone,
    municipality: input.municipality,
    plan: input.plan ?? 'free',
  });

  return { user };
}
