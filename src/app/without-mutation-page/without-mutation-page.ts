import { Component, DestroyRef, PendingTasks, computed, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User, fakeCreateUser, fakeDeleteUser, initialUsers } from '../fake-api';

type Status = 'idle' | 'pending' | 'success' | 'error';

/**
 * Same page as WithMutationPage, but createUser/deleteUser are hand-rolled to show what that primitive replaces:
 * a generation counter (stale-response guard), AbortController cancellation,
 * PendingTasks registration and DestroyRef cleanup, repeated for every mutation.
 */
@Component({
  selector: 'app-without-mutation-page',
  imports: [JsonPipe, RouterLink],
  templateUrl: './without-mutation-page.html',
})
export class WithoutMutationPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly pendingTasks = inject(PendingTasks);
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.createUserAbortController?.abort();
      this.deleteUserAbortController?.abort();
    });
  }

  protected readonly users = signal<User[]>(initialUsers());
  protected readonly newName = signal('');
  protected readonly newNameB = signal('');
  protected readonly deletingUserId = signal<string | null>(null);

  // --- createUser, reimplemented by hand -----------------------------------

  protected readonly createUserStatus = signal<Status>('idle');
  protected readonly createUserValue = signal<User | undefined>(undefined);
  protected readonly createUserError = signal<unknown>(undefined);
  protected readonly createUserIsPending = computed(() => this.createUserStatus() === 'pending');
  protected readonly creatingFormId = signal<'A' | 'B' | null>(null);

  private createUserGeneration = 0;
  private createUserAbortController: AbortController | undefined;

  protected async createUser(name: string, formId: 'A' | 'B' = 'A'): Promise<void> {
    const generation = ++this.createUserGeneration;
    const isStale = () => this.destroyed || generation !== this.createUserGeneration;

    this.createUserAbortController?.abort();
    const abortController = new AbortController();
    this.createUserAbortController = abortController;

    this.creatingFormId.set(formId);
    this.createUserStatus.set('pending');
    this.createUserError.set(undefined);
    const removeTask = this.pendingTasks.add();

    try {
      const user = await fakeCreateUser(name, abortController.signal);
      if (isStale()) return;

      this.createUserStatus.set('success');
      this.createUserValue.set(user);
      this.users.update((current) => [...current, user]);
      if (formId === 'B') {
        this.newNameB.set('');
      } else {
        this.newName.set('');
      }
    } catch (error) {
      if (isStale()) return;

      this.createUserStatus.set('error');
      this.createUserError.set(error);
    } finally {
      removeTask();
    }
  }

  protected resetCreateUser(): void {
    this.createUserStatus.set('idle');
    this.createUserValue.set(undefined);
    this.createUserError.set(undefined);
  }

  // --- deleteUser, reimplemented by hand -----------------------------------

  protected readonly deleteUserStatus = signal<Status>('idle');
  protected readonly deleteUserError = signal<unknown>(undefined);
  protected readonly deleteUserIsPending = computed(() => this.deleteUserStatus() === 'pending');

  private deleteUserGeneration = 0;
  private deleteUserAbortController: AbortController | undefined;

  protected async deleteUser(user: User): Promise<void> {
    const generation = ++this.deleteUserGeneration;
    const isStale = () => this.destroyed || generation !== this.deleteUserGeneration;

    this.deleteUserAbortController?.abort();
    const abortController = new AbortController();
    this.deleteUserAbortController = abortController;

    this.deleteUserStatus.set('pending');
    this.deleteUserError.set(undefined);
    const removeTask = this.pendingTasks.add();

    try {
      await fakeDeleteUser(user, abortController.signal);
      if (isStale()) return;

      this.deleteUserStatus.set('success');
      this.users.update((current) => current.filter((u) => u.id !== user.id));
    } catch (error) {
      if (isStale()) return;

      this.deleteUserStatus.set('error');
      this.deleteUserError.set(error);
    } finally {
      removeTask();
    }
  }

  protected deleteUserClick(user: User): void {
    this.deletingUserId.set(user.id);
    void this.deleteUser(user);
  }

  protected resetDeleteUser(): void {
    this.deleteUserStatus.set('idle');
    this.deleteUserError.set(undefined);
  }
}
