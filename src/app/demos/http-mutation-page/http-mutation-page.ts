import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpMutation } from '@ngsignal/mutation';
import { User } from '../../shared/fake-api';

@Component({
  selector: 'app-http-mutation-page',
  imports: [DecimalPipe],
  templateUrl: './http-mutation-page.html',
})
export class HttpMutationPage {
  private readonly http = inject(HttpClient);

  protected readonly newName = signal('');
  protected readonly newNameForUpload = signal('');

  protected readonly createUser = httpMutation<string, User, HttpErrorResponse>({
    request: (name) => this.http.post<User>('/api/users', { name }),
    onSuccess: () => this.newName.set(''),
  });

  protected readonly createUserWithProgress = httpMutation<string, User, HttpErrorResponse>({
    reportProgress: true,
    request: (name) =>
      this.http.post<User>(
        '/api/users/progress',
        { name },
        { reportProgress: true, observe: 'events' },
      ),
    onSuccess: () => this.newNameForUpload.set(''),
  });

  protected readonly lastCreatedName = computed(() =>
    this.createUser.hasValue() ? this.createUser.value().name : null,
  );

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
