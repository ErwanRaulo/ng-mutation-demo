import { Routes } from '@angular/router';
import { WithMutationPage } from './with-mutation-page/with-mutation-page';
import { WithoutMutationPage } from './without-mutation-page/without-mutation-page';
import { DetailedPage } from './detailed-page/detailed-page';
import { ResourcePage } from './resource-page/resource-page';

export const routes: Routes = [
  { path: '', component: WithMutationPage, title: 'with mutation()' },
  { path: 'manual', component: WithoutMutationPage, title: 'hand-rolled' },
  { path: 'detailed', component: DetailedPage, title: 'detailed (with logs)' },
  { path: 'resource', component: ResourcePage, title: 'with resource()' },
];
