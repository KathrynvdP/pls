import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestAuthPage } from './request-auth.page';

const routes: Routes = [
  {
    path: '',
    component: RequestAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestAuthPageRoutingModule {}
