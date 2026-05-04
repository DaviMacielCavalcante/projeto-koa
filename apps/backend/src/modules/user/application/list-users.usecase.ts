import { t, type Static } from 'elysia';
import { UserPublicType, userPlanValues } from '../domain/user.types';
import { UserRepository } from '../infra/user.repository';

export const listUsersInput = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, default: 10 })),
  search: t.Optional(t.String()),
  plan: t.Optional(t.Enum(userPlanValues)),
});

export const listUsersOutput = t.Object({
  data: t.Array(UserPublicType),
  pagination: t.Object({
    page: t.Number(),
    limit: t.Number(),
    total: t.Number(),
    totalPages: t.Number(),
    hasNext: t.Boolean(),
    hasPrev: t.Boolean(),
  }),
});

type ListUsersInput = Static<typeof listUsersInput>;
type ListUsersOutput = Static<typeof listUsersOutput>;

export async function listUsersUseCase(input: ListUsersInput): Promise<ListUsersOutput> {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;

  return UserRepository.findAll(page, limit, input.search, input.plan);
}
