import { createId } from '@paralleldrive/cuid2';

export function generateId(_options: { type: 'cuid' } = { type: 'cuid' }): string {
  return createId();
}
