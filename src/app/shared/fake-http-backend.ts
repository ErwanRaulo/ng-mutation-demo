import {
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
  HttpEventType,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, concatMap, from, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from './fake-api';

let nextId = 3;

function readName(req: { body: unknown }): string {
  return (req.body as { name?: string })?.name ?? '';
}

function created(user: User): HttpResponse<User> {
  return new HttpResponse({
    status: 201,
    statusText: 'Created',
    headers: new HttpHeaders({ Location: `/api/users/${user.id}` }),
    body: user,
  });
}

/** Simulates an upload made of a few UploadProgress ticks, then the final HttpResponse. */
function simulateUploadProgress(user: User): Observable<HttpEvent<User>> {
  const total = 2_000_000;
  const steps = 5;
  const events: HttpEvent<User>[] = Array.from({ length: steps }, (_, i) => ({
    type: HttpEventType.UploadProgress,
    loaded: Math.round((total * (i + 1)) / steps),
    total,
  }));
  events.push(created(user));
  return from(events).pipe(concatMap((event) => of(event).pipe(delay(400))));
}

/**
 * Fakes /api/users endpoints (same delay/error semantics as fakeCreateUser in fake-api.ts) so
 * the httpMutation() demo exercises a real HttpClient pipeline without a real backend.
 */
export const fakeHttpBackend: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'POST' || (req.url !== '/api/users' && req.url !== '/api/users/progress')) {
    return next(req);
  }

  const name = readName(req);
  if (name.trim().length === 0) {
    return throwError(
      () => new HttpErrorResponse({ status: 422, statusText: 'Name must not be empty', url: req.url }),
    ).pipe(delay(2000));
  }

  const user: User = { id: String(nextId++), name };
  return req.url === '/api/users/progress'
    ? simulateUploadProgress(user)
    : of(created(user)).pipe(delay(2000));
};
