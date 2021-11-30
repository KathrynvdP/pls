import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkshopTruckPage } from './workshop-truck.page';

const routes: Routes = [
  {
    path: '',
    component: WorkshopTruckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkshopTruckPageRoutingModule {}
