import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { httpMutation } from '@ngsignal/mutation';
import { User } from '../../shared/fake-api';

@Component({
  selector: 'app-http-mutation-page',
  imports: [DecimalPipe],
  templateUrl: './http-mutation-page.html',
})
export class HttpMutationPage {
  protected readonly newName = signal('');
  protected readonly newNameForUpload = signal('');

  protected readonly createUser = httpMutation<string, User, HttpErrorResponse>({
    request: (name) => ({ method: 'POST', url: '/api/users', body: { name } }),
    onSuccess: () => this.newName.set(''),
  });

  protected readonly createUserWithProgress = httpMutation<string, User, HttpErrorResponse>({
    request: (name) => ({
      method: 'POST',
      url: '/api/users/progress',
      body: { name },
      reportProgress: true,
    }),
    onSuccess: () => this.newNameForUpload.set(''),
  });

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }

  protected submitWithProgress(): void {
    this.createUserWithProgress.mutate(this.newNameForUpload()).catch(() => {
      // Error is already tracked via createUserWithProgress.error()
    });
  }
}
