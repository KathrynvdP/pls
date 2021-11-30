import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuelRecordPage } from './fuel-record.page';

const routes: Routes = [
  {
    path: '',
    component: FuelRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelRecordPageRoutingModule {}
