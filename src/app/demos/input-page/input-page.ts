import { Component, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser } from '../../shared/fake-api';

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.html',
})
export class InputPage {
  protected readonly newName = signal('');

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: () => this.newName.set(''),
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }

  protected retry(): void {
    const lastInput = this.createUser.input();
    if (lastInput !== undefined) {
      this.createUser.mutate(lastInput).catch(() => {
        // Error is already tracked via createUser.error()
      });
    }
  }
}
