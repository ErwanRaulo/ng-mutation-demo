import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser } from '../../shared/fake-api';

@Component({
  selector: 'app-snapshot-page',
  imports: [RouterLink],
  templateUrl: './snapshot-page.html',
})
export class SnapshotPage {
  protected readonly newName = signal('');

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: () => this.newName.set(''),
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.snapshot().error
    });
  }
}
