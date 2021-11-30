import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WashbayTrailerPage } from './washbay-trailer.page';

const routes: Routes = [
  {
    path: '',
    component: WashbayTrailerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WashbayTrailerPageRoutingModule {}
