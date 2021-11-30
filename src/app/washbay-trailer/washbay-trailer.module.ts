import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WashbayTrailerPageRoutingModule } from './washbay-trailer-routing.module';
import { WashbayTrailerPage } from './washbay-trailer.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    WashbayTrailerPageRoutingModule
  ],
  declarations: [WashbayTrailerPage]
})
export class WashbayTrailerPageModule {}
