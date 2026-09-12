import { Component, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { User, fakeDeleteUser, initialUsers } from '../../shared/fake-api';

@Component({
  selector: 'app-concurrent-deletion-page',
  templateUrl: './concurrent-deletion-page.html',
})
export class ConcurrentDeletionPage {
  protected readonly users = signal<User[]>(initialUsers());
  protected readonly deletingUserId = signal<string | null>(null);
  protected readonly log = signal<string[]>([]);

  protected readonly deleteUser = mutation<User, void>({
    mutationFn: (user, abortSignal) => {
      this.addLog(`deleteUser("${user.name}") started`);
      // Only fires on reset()/destroy() now: a newer call no longer aborts this one, so it
      // keeps running even once superseded.
      abortSignal.addEventListener('abort', () => {
        this.addLog(`deleteUser("${user.name}") aborted by reset() or destroy()`);
      });
      return fakeDeleteUser(user, abortSignal).then(
        (result) => {
          this.addLog(`deleteUser("${user.name}") request finished`);
          return result;
        },
        (error) => {
          this.addLog(`deleteUser("${user.name}") request finished (error)`);
          throw error;
        },
      );
    },
    // Callbacks run for every settled call, superseded or not: only status/error follow the latest.
    onSuccess: (_result, user, { isLatest }) => {
      this.users.update((current) => current.filter((u) => u.id !== user.id));
      this.addLog(`deleteUser("${user.name}") succeeded (isLatest: ${isLatest})`);
    },
    onError: (error, user, { isLatest }) => {
      this.addLog(`deleteUser("${user.name}") failed → ${(error as Error).message} (isLatest: ${isLatest})`);
    },
  });

  protected deleteUserClick(user: User): void {
    this.deletingUserId.set(user.id);
    this.deleteUser.mutate(user).catch(() => {
      // Error is already reported by onError; nothing else to do here.
    });
  }

  private addLog(entry: string): void {
    const time = new Date().toLocaleTimeString();
    this.log.update((entries) => [`${time}: ${entry}`, ...entries].slice(0, 10));
  }
}
