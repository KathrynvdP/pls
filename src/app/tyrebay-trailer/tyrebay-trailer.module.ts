import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TyrebayTrailerPageRoutingModule } from './tyrebay-trailer-routing.module';
import { TyrebayTrailerPage } from './tyrebay-trailer.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TyrebayTrailerPageRoutingModule
  ],
  declarations: [TyrebayTrailerPage]
})
export class TyrebayTrailerPageModule {}
