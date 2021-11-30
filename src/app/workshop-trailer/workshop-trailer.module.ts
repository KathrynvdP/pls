import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkshopTrailerPageRoutingModule } from './workshop-trailer-routing.module';
import { WorkshopTrailerPage } from './workshop-trailer.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    WorkshopTrailerPageRoutingModule
  ],
  declarations: [WorkshopTrailerPage]
})
export class WorkshopTrailerPageModule {}
