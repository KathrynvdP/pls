import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorisePage } from './authorise.page';

const routes: Routes = [
  {
    path: '',
    component: AuthorisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorisePageRoutingModule {}
