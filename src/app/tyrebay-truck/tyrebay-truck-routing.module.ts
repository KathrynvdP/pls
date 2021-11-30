import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TyrebayTruckPage } from './tyrebay-truck.page';

const routes: Routes = [
  {
    path: '',
    component: TyrebayTruckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TyrebayTruckPageRoutingModule {}
