import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderTrackingPageRoutingModule } from './order-tracking-routing.module';
import { OrderTrackingPage } from './order-tracking.page';
import { AgmCoreModule } from '@agm/core';
import { SignaturePadModule } from 'angular2-signaturepad';

import {SigniturePageComponent} from '../signiture-page/signiture-page.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderTrackingPageRoutingModule,
    AgmCoreModule,
    SignaturePadModule
  ],
  entryComponents: [SigniturePageComponent],
  declarations: [OrderTrackingPage, SigniturePageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderTrackingPageModule {}
