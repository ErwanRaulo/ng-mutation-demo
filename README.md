# @ngsignal/mutation demo

A small Angular app showcasing `mutation()` primitive.

It has three routes showing the same "user list" feature:

- **`/`**  [`WithMutationPage`](src/app/demos/with-mutation-page/with-mutation-page.ts) implements `createUser`/`deleteUser` with `mutation()`: pending/error state and stale-response guarding come for free (no auto-cancellation: a superseded call still runs to completion, only its outcome is ignored).
- **`/concurrent-deletion`**  [`ConcurrentDeletionPage`](src/app/demos/concurrent-deletion-page/concurrent-deletion-page.ts) isolates that stale-response guarding behavior: delete two different users quickly and watch the activity log show the superseded call finish in the background without its `onSuccess` ever firing.
- **`/manual`**  [`WithoutMutationPage`](src/app/demos/without-mutation-page/without-mutation-page.ts) implements the exact same feature by hand, to show what `mutation()` replaces.
- **`/detailed`**  [`DetailedPage`](src/app/demos/detailed-page/detailed-page.ts) is the `mutation()` version again, but with the full state panel and a step-by-step activity log for every call, so you can watch superseded calls keep running and race-condition handling happen in real time.

The "API" calls in [`fake-api.ts`](src/app/shared/fake-api.ts) are simulated with a delay so you can see pending/loading states and try racing requests.

- **`/http`**  [`HttpMutationPage`](src/app/demos/http-mutation-page/http-mutation-page.ts) is the same "create user" feature, but built with `httpMutation()` and a real `HttpClient.post()` call, plus a second form using `reportProgress: true` to drive a live upload progress bar. [`fake-http-backend.ts`](src/app/shared/fake-http-backend.ts) is an `HttpInterceptorFn` standing in for a real server.

## Running it

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

## Building

```bash
npm run build
```
