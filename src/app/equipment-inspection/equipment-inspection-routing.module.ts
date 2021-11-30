import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentInspectionPage } from './equipment-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentInspectionPageRoutingModule {}
