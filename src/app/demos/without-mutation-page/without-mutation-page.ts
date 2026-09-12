import { Component, DestroyRef, PendingTasks, computed, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User, fakeCreateUser, fakeDeleteUser, initialUsers } from '../../shared/fake-api';

type Status = 'idle' | 'pending' | 'success' | 'error';

/**
 * Same page as WithMutationPage, but createUser/deleteUser are hand-rolled to show what that primitive replaces:
 * a generation counter (stale-response guard), an AbortController wired up per call (only ever
 * aborted on destroy, never on supersession), PendingTasks registration and DestroyRef cleanup,
 * repeated for every mutation.
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
      for (const controller of this.createUserAbortControllers) {
        controller.abort();
      }
      for (const controller of this.deleteUserAbortControllers) {
        controller.abort();
      }
    });
  }

  protected readonly users = signal<User[]>(initialUsers());
  protected readonly newName = signal('');
  protected readonly deletingUserId = signal<string | null>(null);

  // --- createUser, reimplemented by hand -----------------------------------

  protected readonly createUserStatus = signal<Status>('idle');
  protected readonly createUserValue = signal<User | undefined>(undefined);
  protected readonly createUserError = signal<unknown>(undefined);
  protected readonly createUserIsPending = computed(() => this.createUserStatus() === 'pending');

  private createUserGeneration = 0;
  private readonly createUserAbortControllers = new Set<AbortController>();

  protected async createUser(name: string): Promise<void> {
    const generation = ++this.createUserGeneration;
    const isStale = () => this.destroyed || generation !== this.createUserGeneration;

    const abortController = new AbortController();
    this.createUserAbortControllers.add(abortController);

    this.createUserStatus.set('pending');
    this.createUserError.set(undefined);
    const removeTask = this.pendingTasks.add();

    try {
      const user = await fakeCreateUser(name, abortController.signal);
      if (isStale()) return;

      this.createUserStatus.set('success');
      this.createUserValue.set(user);
      this.users.update((current) => [...current, user]);
      this.newName.set('');
    } catch (error) {
      if (isStale()) return;

      this.createUserStatus.set('error');
      this.createUserError.set(error);
    } finally {
      removeTask();
      this.createUserAbortControllers.delete(abortController);
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
  private readonly deleteUserAbortControllers = new Set<AbortController>();

  protected async deleteUser(user: User): Promise<void> {
    const generation = ++this.deleteUserGeneration;
    const isStale = () => this.destroyed || generation !== this.deleteUserGeneration;

    const abortController = new AbortController();
    this.deleteUserAbortControllers.add(abortController);

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
      this.deleteUserAbortControllers.delete(abortController);
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
