import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser, fakeDeleteUser, initialUsers } from '../../shared/fake-api';

@Component({
  selector: 'app-with-mutation-detail',
  imports: [JsonPipe],
  templateUrl: './with-mutation-detail.html',
})
export class WithMutationDetail {
  protected readonly users = signal<User[]>(initialUsers());

  protected readonly newName = signal('');
  protected readonly newNameB = signal('');
  protected readonly creatingFormId = signal<'A' | 'B' | null>(null);
  protected readonly deletingUserId = signal<string | null>(null);
  protected readonly log = signal<string[]>([]);

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => {
      this.addLog(`createUser("${name || '(empty)'}") started`);
      // Only fires on reset()/destroy() now: a newer call no longer aborts this one, so it
      // keeps running even once superseded.
      abortSignal.addEventListener('abort', () => {
        this.addLog(`createUser("${name || '(empty)'}") aborted by reset() or destroy()`);
      });
      return fakeCreateUser(name, abortSignal).then(
        (user) => {
          this.addLog(`createUser("${name || '(empty)'}") request finished`);
          return user;
        },
        (error) => {
          this.addLog(`createUser("${name || '(empty)'}") request finished (error)`);
          throw error;
        },
      );
    },
    onSuccess: (user) => {
      this.users.update((current) => [...current, user]);
      if (this.creatingFormId() === 'B') {
        this.newNameB.set('');
      } else {
        this.newName.set('');
      }
      // Only logged for the still-current call: a superseded one finishes above but never
      // reaches here, since onSuccess/onError are gated the same way status/value/error are.
      this.addLog(`createUser succeeded → ${user.name}`);
    },
    onError: (error) => {
      this.addLog(`createUser failed → ${(error as Error).message}`);
    },
  });

  protected readonly deleteUser = mutation<User, void>({
    mutationFn: (user, abortSignal) => {
      this.addLog(`deleteUser("${user.name}") started`);
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
    onSuccess: (_result, user) => {
      this.users.update((current) => current.filter((u) => u.id !== user.id));
      this.addLog(`deleteUser("${user.name}") succeeded`);
    },
    onError: (error, user) => {
      this.addLog(`deleteUser("${user.name}") failed → ${(error as Error).message}`);
    },
  });

  protected submit(): void {
    this.creatingFormId.set('A');
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error(); nothing else to do here.
    });
  }

  protected submitB(): void {
    this.creatingFormId.set('B');
    this.createUser.mutate(this.newNameB()).catch(() => {
      // Error is already tracked via createUser.error(); nothing else to do here.
    });
  }

  protected deleteUserClick(user: User): void {
    this.deletingUserId.set(user.id);
    this.deleteUser.mutate(user).catch(() => {
      // Error is already tracked via deleteUser.error(); nothing else to do here.
    });
  }

  private addLog(entry: string): void {
    const time = new Date().toLocaleTimeString();
    this.log.update((entries) => [`${time}: ${entry}`, ...entries].slice(0, 10));
  }
}
