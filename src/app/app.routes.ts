import { Routes } from '@angular/router';
import { WithMutationPage } from './demos/with-mutation-page/with-mutation-page';
import { NoCallbacksPage } from './demos/no-callbacks-page/no-callbacks-page';
import { ConcurrentDeletionPage } from './demos/concurrent-deletion-page/concurrent-deletion-page';
import { WithoutMutationPage } from './demos/without-mutation-page/without-mutation-page';
import { WorkingWithResourcePage } from './demos/working-with-resource-page/working-with-resource-page';
import { DetailedPage } from './demos/detailed-page/detailed-page';
import { HasValuePage } from './demos/has-value-page/has-value-page';
import { SnapshotPage } from './demos/snapshot-page/snapshot-page';
import { HttpMutationPage } from './demos/http-mutation-page/http-mutation-page';

export const routes: Routes = [
  { path: '', component: WithMutationPage, title: 'Callbacks (onSuccess / onError)' },
  { path: 'no-callbacks', component: NoCallbacksPage, title: 'No callbacks (await mutate())' },
  {
    path: 'concurrent-deletion',
    component: ConcurrentDeletionPage,
    title: 'Concurrent deletion (stale-response guarding)',
  },
  { path: 'manual', component: WithoutMutationPage, title: 'Hand-rolled (no mutation())' },
  { path: 'resource', component: WorkingWithResourcePage, title: 'Working with resource' },
  { path: 'detailed', component: DetailedPage, title: 'Detailed activity log' },
  { path: 'has-value', component: HasValuePage, title: 'hasValue() type-guard' },
  { path: 'snapshot', component: SnapshotPage, title: 'snapshot() discriminated union' },
  { path: 'http', component: HttpMutationPage, title: 'httpMutation() with HttpClient' },
];
