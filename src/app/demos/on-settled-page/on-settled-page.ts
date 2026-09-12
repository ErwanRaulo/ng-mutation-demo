import { Component, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { User, fakeCreateUser } from '../../shared/fake-api';

@Component({
  selector: 'app-on-settled-page',
  templateUrl: './on-settled-page.html',
})
export class OnSettledPage {
  protected readonly isPanelOpen = signal(false);
  protected readonly newName = signal('');
  protected readonly log = signal<string[]>([]);

  protected readonly createUser = mutation<string, User>({
    mutationFn: (name, abortSignal) => fakeCreateUser(name, abortSignal),
    onSuccess: () => this.log.update((entries) => [...entries, 'onSuccess']),
    onError: () => this.log.update((entries) => [...entries, 'onError']),
    // Runs whichever branch fired above: this is the one place that closes the panel.
    onSettled: () => {
      this.log.update((entries) => [...entries, 'onSettled → close panel']);
      this.isPanelOpen.set(false);
    },
  });

  protected openPanel(): void {
    this.log.set([]);
    this.newName.set('');
    this.createUser.reset();
    this.isPanelOpen.set(true);
  }

  protected submit(): void {
    this.createUser.mutate(this.newName()).catch(() => {
      // Error is already tracked via createUser.error()
    });
  }
}
