import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { rxMutation } from '@ngsignal/mutation';
import { User } from '../../shared/fake-api';

@Component({
  selector: 'app-rx-mutation-page',
  templateUrl: './rx-mutation-page.html',
})
export class RxMutationPage {
  private readonly http = inject(HttpClient);

  protected readonly newName = signal('');

  protected readonly createUser = rxMutation<string, User, HttpErrorResponse>({
    mutationFn: (name) => this.http.post<User>('/api/users', { name }),
    onSuccess: () => this.newName.set(''),
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }
}
