import { Component, resource, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser, fakeFetchUsers } from '../../shared/fake-api';

/**
 * "Refreshing a resource after a mutation" recipe: usersResource is the source of truth, and
 * createUser has no cache of its own, so on success it just tells the resource to reload.
 */
@Component({
  selector: 'app-refresh-resource-demo',
  imports: [JsonPipe],
  templateUrl: './refresh-resource-demo.html',
})
export class RefreshResourceDemo {
  protected readonly usersResource = resource({
    loader: ({ abortSignal }) => fakeFetchUsers(abortSignal),
    defaultValue: [] as User[],
  });

  protected readonly newName = signal('');

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: () => {
      this.usersResource.reload();
      this.newName.set('');
    },
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }
}
