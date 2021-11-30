import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartOrderPage } from './start-order.page';

const routes: Routes = [
  {
    path: '',
    component: StartOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartOrderPageRoutingModule {}
