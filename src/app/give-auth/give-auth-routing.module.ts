import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiveAuthPage } from './give-auth.page';

const routes: Routes = [
  {
    path: '',
    component: GiveAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiveAuthPageRoutingModule {}
