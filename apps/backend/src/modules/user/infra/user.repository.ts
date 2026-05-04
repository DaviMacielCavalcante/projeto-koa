import { db, type Transaction } from '@/shared/infra/databases/postgres';
import { and, count, desc, eq, ilike } from 'drizzle-orm';
import { usersSchema, type NewUser, type User } from '../domain/user.schema';

export type UserPublic = Omit<User, 'password_hash'>;

const publicSelect = {
  id: usersSchema.id,
  name: usersSchema.name,
  email: usersSchema.email,
  phone: usersSchema.phone,
  municipality: usersSchema.municipality,
  plan: usersSchema.plan,
  createdAt: usersSchema.createdAt,
  updatedAt: usersSchema.updatedAt,
};

export class UserRepository {
  static async create(data: NewUser, tx?: Transaction): Promise<UserPublic> {
    const dbInstance = tx ?? db;

    const [user] = await dbInstance.insert(usersSchema).values(data).returning(publicSelect);

    return user!;
  }

  static async findAll(
    page: number,
    limit: number,
    search?: string,
    plan?: 'free' | 'premium',
    tx?: Transaction,
  ) {
    const offset = (page - 1) * limit;

    const filters = [];
    if (search) filters.push(ilike(usersSchema.name, `%${search}%`));
    if (plan) filters.push(eq(usersSchema.plan, plan));

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const dbInstance = tx ?? db;

    const [data, totalResult] = await Promise.all([
      dbInstance
        .select(publicSelect)
        .from(usersSchema)
        .where(whereClause)
        .orderBy(desc(usersSchema.createdAt))
        .limit(limit)
        .offset(offset),
      dbInstance.select({ total: count() }).from(usersSchema).where(whereClause),
    ]);

    const total = totalResult[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static async findById({ id }: { id: string }, tx?: Transaction): Promise<UserPublic | null> {
    const dbInstance = tx ?? db;

    const [user] = await dbInstance
      .select(publicSelect)
      .from(usersSchema)
      .where(eq(usersSchema.id, id))
      .limit(1);

    return user ?? null;
  }

  static async findByEmail(
    { email }: { email: string },
    tx?: Transaction,
  ): Promise<UserPublic | null> {
    const dbInstance = tx ?? db;

    const [user] = await dbInstance
      .select(publicSelect)
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);

    return user ?? null;
  }

  // Variante interna que retorna o password_hash. Use apenas em fluxos de autenticação;
  // nunca exponha o resultado em controllers/respostas HTTP.
  static async findByEmailWithHash(
    { email }: { email: string },
    tx?: Transaction,
  ): Promise<User | null> {
    const dbInstance = tx ?? db;

    const [user] = await dbInstance
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);

    return user ?? null;
  }

  static async update(
    id: string,
    data: Partial<NewUser>,
    tx?: Transaction,
  ): Promise<UserPublic | null> {
    const dbInstance = tx ?? db;

    const [user] = await dbInstance
      .update(usersSchema)
      .set({ ...data })
      .where(eq(usersSchema.id, id))
      .returning(publicSelect);

    return user ?? null;
  }

  static async delete(id: string, tx?: Transaction): Promise<UserPublic | null> {
    const dbInstance = tx ?? db;

    const [user] = await dbInstance
      .delete(usersSchema)
      .where(eq(usersSchema.id, id))
      .returning(publicSelect);

    return user ?? null;
  }
}
