import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TyrebayInspectionPage } from './tyrebay-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: TyrebayInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TyrebayInspectionPageRoutingModule {}
