import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripSheetPage } from './trip-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: TripSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripSheetPageRoutingModule {}
