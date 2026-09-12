import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser, fakeDeleteUser, initialUsers } from '../../shared/fake-api';

/**
 * Same "user list" feature, but neither mutation() call takes an onSuccess/onError: the call
 * site awaits mutate() and handles the result right there instead.
 */
@Component({
  selector: 'app-no-callbacks-page',
  imports: [JsonPipe, RouterLink],
  templateUrl: './no-callbacks-page.html',
})
export class NoCallbacksPage {
  protected readonly users = signal<User[]>(initialUsers());
  protected readonly newName = signal('');
  protected readonly deletingUserId = signal<string | null>(null);

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
  });

  protected readonly deleteUser = mutation<User, void>({
    mutationFn: (user, abortSignal) => fakeDeleteUser(user, abortSignal),
  });

  protected async submit(): Promise<void> {
    try {
      const user = await this.createUser.mutate(this.newName());
      // mutate() always resolves with the real value now, superseded or not: a write that
      // reached the server can't be un-happened, so there's no stale result left to filter out
      // here the way older versions needed to.
      this.users.update((current) => [...current, user]);
      this.newName.set('');
    } catch {
      // createUser.error() already holds the failure; nothing else to do here.
    }
  }

  protected async deleteUserClick(user: User): Promise<void> {
    this.deletingUserId.set(user.id);
    try {
      await this.deleteUser.mutate(user);
      // Same reasoning as createUser above: this resolving means this specific user really got
      // deleted server-side, so it's applied unconditionally, even if another delete has since
      // become the "current" one. deletingUserId only drives the per-row "Deleting…" indicator
      // below, it no longer gates whether the result is real.
      this.users.update((current) => current.filter((u) => u.id !== user.id));
    } catch {
      // deleteUser.error() already holds the failure; nothing else to do here.
    }
  }
}
