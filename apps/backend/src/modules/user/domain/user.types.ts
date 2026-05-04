import { t, type Static } from 'elysia';

export const userPlanValues = {
  free: 'free',
  premium: 'premium',
} as const;

export const UserType = t.Object({
  id: t.String({ minLength: 1 }),
  name: t.String({ minLength: 1, maxLength: 255 }),
  email: t.String({ format: 'email', maxLength: 255 }),
  password_hash: t.String({ minLength: 1, maxLength: 255 }),
  phone: t.String({ minLength: 1, maxLength: 20 }),
  municipality: t.String({ minLength: 1, maxLength: 255 }),
  plan: t.Enum(userPlanValues),
  createdAt: t.Date(),
  updatedAt: t.Nullable(t.Date()),
});

export const UserPublicType = t.Omit(UserType, ['password_hash']);

export type User = Static<typeof UserType>;
export type UserPublic = Static<typeof UserPublicType>;
