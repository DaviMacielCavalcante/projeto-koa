import { pgEnum } from 'drizzle-orm/pg-core';

export const ID_LENGHT = 24;

export const userPlanEnum = pgEnum('user_plan', ['free', 'premium']);
