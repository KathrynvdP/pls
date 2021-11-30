import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TyrebayTrailerPage } from './tyrebay-trailer.page';

const routes: Routes = [
  {
    path: '',
    component: TyrebayTrailerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TyrebayTrailerPageRoutingModule {}
