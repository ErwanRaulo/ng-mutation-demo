import { Component, signal } from '@angular/core';
import { RefreshResourceDemo } from './refresh-resource-demo';
import { OptimisticUpdateDemo } from './optimistic-update-demo';

type Recipe = 'refresh' | 'optimistic';

/**
 * mutation() has no cache and won't touch a resource()/httpResource() for you: this page
 * groups the two "Working with resource" recipes from the docs behind an in-page tab switch,
 * same grouping as docs/RECIPES.md.
 */
@Component({
  selector: 'app-working-with-resource-page',
  imports: [RefreshResourceDemo, OptimisticUpdateDemo],
  templateUrl: './working-with-resource-page.html',
})
export class WorkingWithResourcePage {
  protected readonly recipe = signal<Recipe>('refresh');
}
