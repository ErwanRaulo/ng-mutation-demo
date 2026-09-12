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

/** Simulates a download made of a few DownloadProgress ticks (only with reportProgress: true), then the file. */
function simulateCsvExport(reportProgress: boolean): Observable<HttpEvent<Blob>> {
  const csv = 'id,name\n1,Ada Lovelace\n2,Alan Turing\n';
  const file = new Blob([csv], { type: 'text/csv' });
  const steps = 5;
  const progress: HttpEvent<Blob>[] = Array.from({ length: steps }, (_, i) => ({
    type: HttpEventType.DownloadProgress,
    loaded: Math.round((file.size * (i + 1)) / steps),
    total: file.size,
  }));
  const response = new HttpResponse({ status: 200, statusText: 'OK', body: file });
  const events = reportProgress ? [...progress, response] : [response];
  return from(events).pipe(concatMap((event) => of(event).pipe(delay(400))));
}

/**
 * Fakes /api/users endpoints (same delay/error semantics as fakeCreateUser in fake-api.ts) so
 * the httpMutation() demo exercises a real HttpClient pipeline without a real backend.
 */
export const fakeHttpBackend: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'POST') {
    return next(req);
  }

  switch (req.url) {
    // Answers with an outdated body shape, to show what parse() does with a contract mismatch.
    case '/api/users/outdated':
      return of(
        new HttpResponse({ status: 201, statusText: 'Created', body: { userId: nextId++, fullName: readName(req) } }),
      ).pipe(delay(2000));
    case '/api/exports/users':
      return simulateCsvExport(req.reportProgress);
    // Plain-text body: the number of purged users.
    case '/api/users/purge-inactive':
      return of(new HttpResponse({ status: 200, statusText: 'OK', body: '2' })).pipe(delay(2000));
  }

  if (req.url !== '/api/users' && req.url !== '/api/users/progress') {
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
