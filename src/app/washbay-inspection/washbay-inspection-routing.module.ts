import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WashbayInspectionPage } from './washbay-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: WashbayInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WashbayInspectionPageRoutingModule {}
