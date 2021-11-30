import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DieselbayScanPage } from './dieselbay-scan.page';

const routes: Routes = [
  {
    path: '',
    component: DieselbayScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DieselbayScanPageRoutingModule {}
