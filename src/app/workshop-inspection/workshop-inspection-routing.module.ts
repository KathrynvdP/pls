import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkshopInspectionPage } from './workshop-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: WorkshopInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkshopInspectionPageRoutingModule {}
