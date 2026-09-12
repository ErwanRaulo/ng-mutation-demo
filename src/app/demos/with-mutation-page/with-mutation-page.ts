import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser, fakeDeleteUser, initialUsers } from '../../shared/fake-api';

@Component({
  selector: 'app-with-mutation-page',
  imports: [JsonPipe, RouterLink],
  templateUrl: './with-mutation-page.html',
})
export class WithMutationPage {
  protected readonly users = signal<User[]>(initialUsers());

  protected readonly newName = signal('');
  protected readonly deletingUserId = signal<string | null>(null);

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: (user) => {
      this.users.update((current) => [...current, user]);
      this.newName.set('');
    },
  });

  protected readonly deleteUser = mutation<User, void>({
    mutationFn: (user, abortSignal) => fakeDeleteUser(user, abortSignal),
    onSuccess: (_result, user) => {
      this.users.update((current) => current.filter((u) => u.id !== user.id));
    },
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }

  protected deleteUserClick(user: User): void {
    this.deletingUserId.set(user.id);
    this.deleteUser.mutate(user).catch(() => {
      // Error is already tracked via deleteUser.error()
    });
  }
}
