import { Component, resource, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { User, fakeDeleteUser, fakeFetchUsers } from '../../shared/fake-api';

/**
 * "Optimistic updates" recipe: usersResource.value() is mutated immediately, before the
 * request even resolves, then rolled back in mutate().catch() if it fails. No onSuccess/onError
 * on the mutation itself, the resource is the one being written to directly.
 */
@Component({
  selector: 'app-optimistic-update-demo',
  templateUrl: './optimistic-update-demo.html',
})
export class OptimisticUpdateDemo {
  protected readonly usersResource = resource({
    loader: ({ abortSignal }) => fakeFetchUsers(abortSignal),
    defaultValue: [] as User[],
  });

  protected readonly deletingUserId = signal<string | null>(null);

  protected readonly deleteUser = mutation<User, void>({
    mutationFn: (user, abortSignal) => fakeDeleteUser(user, abortSignal),
  });

  protected deleteUserClick(user: User): void {
    this.deletingUserId.set(user.id);
    const previous = this.usersResource.value();
    this.usersResource.update((users) => users.filter((u) => u.id !== user.id));

    this.deleteUser.mutate(user).catch(() => {
      this.usersResource.set(previous);
    });
  }
}
