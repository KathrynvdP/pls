import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkshopTrailerPage } from './workshop-trailer.page';

const routes: Routes = [
  {
    path: '',
    component: WorkshopTrailerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkshopTrailerPageRoutingModule {}
