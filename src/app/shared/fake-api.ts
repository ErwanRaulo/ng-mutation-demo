export interface User {
  id: string;
  name: string;
}

let nextId = 3;

export function delay<T>(value: T, ms: number, abortSignal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(value), ms);
    abortSignal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function initialUsers(): User[] {
  return [
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper' },
  ];
}

let serverUsers: User[] = initialUsers();

export function fakeFetchUsers(abortSignal: AbortSignal): Promise<User[]> {
  return delay(serverUsers, 800, abortSignal).then((users) => [...users]);
}

export function fakeCreateUser(name: string, abortSignal: AbortSignal): Promise<User> {
  if (name.trim().length === 0) {
    return Promise.reject(new Error('Name must not be empty'));
  }
  const user = { id: String(nextId++), name };
  return delay(user, 2000, abortSignal).then((created) => {
    serverUsers = [...serverUsers, created];
    return created;
  });
}

export function fakeDeleteUser(user: User, abortSignal: AbortSignal): Promise<void> {
  return delay(undefined, 2000, abortSignal).then(() => {
    if (user.name === 'Grace Hopper') {
      throw new Error(`Server refused to delete ${user.name}`);
    }
    serverUsers = serverUsers.filter((u) => u.id !== user.id);
  });
}

export class ValidationError extends Error {
  constructor(
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function fakeCreateUserStrict(name: string, abortSignal: AbortSignal): Promise<User> {
  if (name.trim().length === 0) {
    return Promise.reject(new ValidationError('name', 'Name must not be empty'));
  }
  return fakeCreateUser(name, abortSignal);
}

export type ReorderScenario = 'no-queue' | 'queue';

export const initialReorderOrder = ['Alpha', 'Bravo', 'Charlie'];
const reorderServerOrder: Record<ReorderScenario, string[]> = {
  'no-queue': [...initialReorderOrder],
  queue: [...initialReorderOrder],
};

/**
 * Moves `item` to the front of the given scenario's server-side order. "Charlie" is given a
 * deliberately longer artificial delay than the others, so moving it and then another item in
 * quick succession reliably races the two requests — this is a demo-only trick, not something
 * mutation() does.
 */
export function fakeMoveToTop(
  scenario: ReorderScenario,
  item: string,
  abortSignal: AbortSignal,
): Promise<string[]> {
  const artificialDelayMs = item === 'Charlie' ? 1200 : 300;
  return delay(undefined, artificialDelayMs, abortSignal).then(() => {
    const next = [item, ...reorderServerOrder[scenario].filter((existing) => existing !== item)];
    reorderServerOrder[scenario] = next;
    return next;
  });
}

export function resetReorderScenario(scenario: ReorderScenario): string[] {
  reorderServerOrder[scenario] = [...initialReorderOrder];
  return reorderServerOrder[scenario];
}

export type PaymentScenario = 'no-drop' | 'drop';

export interface Charge {
  id: number;
  amount: number;
}

let nextChargeId = 1;
const paymentServerCharges: Record<PaymentScenario, Charge[]> = {
  'no-drop': [],
  drop: [],
};

/**
 * Records a charge on the given scenario's fake server. The 1.5s artificial delay leaves plenty
 * of time for a second click to land while the first request is still in flight.
 */
export function fakeCharge(
  scenario: PaymentScenario,
  amount: number,
  abortSignal: AbortSignal,
): Promise<Charge[]> {
  const charge = { id: nextChargeId++, amount };
  return delay(undefined, 1500, abortSignal).then(() => {
    paymentServerCharges[scenario] = [...paymentServerCharges[scenario], charge];
    return paymentServerCharges[scenario];
  });
}

export function resetPaymentScenario(scenario: PaymentScenario): Charge[] {
  paymentServerCharges[scenario] = [];
  return paymentServerCharges[scenario];
}
