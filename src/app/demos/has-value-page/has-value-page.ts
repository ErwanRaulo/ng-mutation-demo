import { Component, computed, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser } from '../../shared/fake-api';

@Component({
  selector: 'app-has-value-page',
  templateUrl: './has-value-page.html',
})
export class HasValuePage {
  protected readonly newName = signal('');

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: () => this.newName.set(''),
  });

  // hasValue() narrows value() from `User | undefined` to `User`, so this computed
  // can read `.name` directly, without an extra undefined-check or `!`.
  protected readonly lastCreatedName = computed(() =>
    this.createUser.hasValue() ? this.createUser.value().name : null,
  );

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }
}
