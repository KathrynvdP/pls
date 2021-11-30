import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DieselbayInspectionPage } from './dieselbay-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: DieselbayInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DieselbayInspectionPageRoutingModule {}
