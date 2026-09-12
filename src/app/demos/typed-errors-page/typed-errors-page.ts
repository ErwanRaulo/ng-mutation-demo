import { Component, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { User, ValidationError, fakeCreateUserStrict } from '../../shared/fake-api';

@Component({
  selector: 'app-typed-errors-page',
  templateUrl: './typed-errors-page.html',
})
export class TypedErrorsPage {
  protected readonly newName = signal('');

  // The third type argument makes error()/onError's error typed as ValidationError instead of
  // unknown — no `as ValidationError` cast needed to read `.field` below.
  protected readonly createUser = mutation<string, User, ValidationError>({
    mutationFn: (name, abortSignal) => fakeCreateUserStrict(name, abortSignal),
    onSuccess: () => this.newName.set(''),
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }
}
