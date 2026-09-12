import { Component } from '@angular/core';
import { WithMutationDetail } from './with-mutation-detail';

@Component({
  selector: 'app-detailed-page',
  imports: [WithMutationDetail],
  templateUrl: './detailed-page.html',
})
export class DetailedPage {}
