import { Component, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { fakeMoveToTop, initialReorderOrder, resetReorderScenario } from '../../shared/fake-api';

@Component({
  selector: 'app-concurrency-queue-page',
  templateUrl: './concurrency-queue-page.html',
})
export class ConcurrencyQueuePage {
  protected readonly items = initialReorderOrder;
  protected readonly log = signal<string[]>([]);

  // The "server order" signals are read directly from the fake API below, outside of
  // mutation()'s own state — they're what the app would see if it re-fetched from the server,
  // used here only to reveal what mutation.value() alone can't show you.
  protected readonly noQueueServerOrder = signal(resetReorderScenario('no-queue'));
  protected readonly queueServerOrder = signal(resetReorderScenario('queue'));

  protected readonly moveNoQueue = mutation<string, string[]>({
    mutationFn: (item, abortSignal) =>
      fakeMoveToTop('no-queue', item, abortSignal).then((order) => {
        this.noQueueServerOrder.set(order);
        this.addLog(
          `no concurrency option: "${item}" request finished → server is [${order.join(', ')}]`,
        );
        return order;
      }),
  });

  protected readonly moveQueued = mutation<string, string[]>({
    concurrency: 'queue',
    mutationFn: (item, abortSignal) =>
      fakeMoveToTop('queue', item, abortSignal).then((order) => {
        this.queueServerOrder.set(order);
        this.addLog(
          `concurrency: 'queue': "${item}" request finished → server is [${order.join(', ')}]`,
        );
        return order;
      }),
  });

  protected moveToTop(item: string): void {
    this.moveNoQueue.mutate(item).catch(() => {
      // Only reachable if reset() aborts this call mid-flight; reset() already put the
      // mutation back to idle, so there's nothing left to do with the resulting rejection.
    });
    this.moveQueued.mutate(item).catch(() => {
      // Only reachable if reset() aborts this call mid-flight; reset() already put the
      // mutation back to idle, so there's nothing left to do with the resulting rejection.
    });
  }

  protected reset(): void {
    this.log.set([]);
    this.moveNoQueue.reset();
    this.moveQueued.reset();
    this.noQueueServerOrder.set(resetReorderScenario('no-queue'));
    this.queueServerOrder.set(resetReorderScenario('queue'));
  }

  private addLog(entry: string): void {
    const time = new Date().toLocaleTimeString();
    this.log.update((entries) => [...entries, `${time}: ${entry}`]);
  }
}
