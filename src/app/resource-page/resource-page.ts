import { Component, resource, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser, fakeDeleteUser, fakeFetchUsers } from '../fake-api';

/**
 * Same "user list" feature as the other pages, but backed by resource() instead of a plain
 * signal(): the list itself is server state, not local state the pages update by hand.
 */
@Component({
  selector: 'app-resource-page',
  imports: [JsonPipe, RouterLink],
  templateUrl: './resource-page.html',
})
export class ResourcePage {
  protected readonly usersResource = resource({
    loader: ({ abortSignal }) => fakeFetchUsers(abortSignal),
    defaultValue: [] as User[],
  });

  protected readonly newName = signal('');
  protected readonly deletingUserId = signal<string | null>(null);

  // Refresh pattern: onSuccess re-runs the loader, server stays the source of truth.
  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: () => {
      this.usersResource.reload();
      this.newName.set('');
    },
  });

  // Optimistic update pattern: mutate usersResource.value() immediately, roll back on error.
  protected readonly deleteUser = mutation<User, void>({
    mutationFn: (user, abortSignal) => fakeDeleteUser(user, abortSignal),
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }

  protected deleteUserClick(user: User): void {
    this.deletingUserId.set(user.id);
    const previous = this.usersResource.value();
    this.usersResource.update((users) => users.filter((u) => u.id !== user.id));

    this.deleteUser.mutate(user).catch(() => {
      this.usersResource.set(previous);
    });
  }
}
