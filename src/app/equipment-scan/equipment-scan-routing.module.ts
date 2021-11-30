import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentScanPage } from './equipment-scan.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentScanPageRoutingModule {}
