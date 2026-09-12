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
