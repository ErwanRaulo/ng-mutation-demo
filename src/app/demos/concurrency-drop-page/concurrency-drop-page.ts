import { Component, signal } from '@angular/core';
import { mutation } from '@ngsignal/mutation';
import { type Charge, fakeCharge, resetPaymentScenario } from '../../shared/fake-api';

const AMOUNT = 50;

@Component({
  selector: 'app-concurrency-drop-page',
  templateUrl: './concurrency-drop-page.html',
})
export class ConcurrencyDropPage {
  protected readonly amount = AMOUNT;
  protected readonly log = signal<string[]>([]);

  protected readonly payNoDrop = mutation<number, Charge[]>({
    mutationFn: (amount, abortSignal) => fakeCharge('no-drop', amount, abortSignal),
  });

  protected readonly payDrop = mutation<number, Charge[]>({
    concurrency: 'drop',
    mutationFn: (amount, abortSignal) => fakeCharge('drop', amount, abortSignal),
  });

  protected pay(): void {
    this.payNoDrop.mutate(AMOUNT).then(
      () => this.addLog("no concurrency option: charge request finished"),
      () => undefined,
    );
    this.payDrop.mutate(AMOUNT).then(
      () => this.addLog("concurrency: 'drop': charge request finished"),
      (error: unknown) => {
        // A dropped call rejects with an AbortError whose message is 'Dropped'; mutationFn
        // never ran and the mutation's signals were left untouched.
        if (error instanceof DOMException && error.message === 'Dropped') {
          this.addLog("concurrency: 'drop': click dropped, a charge is already in flight");
        }
      },
    );
  }

  protected reset(): void {
    this.log.set([]);
    this.payNoDrop.reset();
    this.payDrop.reset();
    resetPaymentScenario('no-drop');
    resetPaymentScenario('drop');
  }

  private addLog(entry: string): void {
    const time = new Date().toLocaleTimeString();
    this.log.update((entries) => [...entries, `${time}: ${entry}`]);
  }
}
