import { Elysia } from 'elysia';

export type AuthenticatedUser = {
  id: string;
  role: 'admin' | 'free' | 'premium';
};

// TODO: substituir pelo módulo de auth real quando ele existir.
// Stub atual sempre retorna um admin para desbloquear o desenvolvimento dos demais módulos.
async function validateToken(_request: Request): Promise<AuthenticatedUser> {
  return { id: 'stub-user-id', role: 'admin' };
}

type ControllerOptions = {
  prefix: string;
  tags?: string[];
};

export function createController({ prefix, tags }: ControllerOptions) {
  return new Elysia({ prefix, tags }).decorate('validateToken', validateToken);
}
