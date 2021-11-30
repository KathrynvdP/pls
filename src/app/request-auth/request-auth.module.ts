import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestAuthPageRoutingModule } from './request-auth-routing.module';

import { RequestAuthPage } from './request-auth.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    RequestAuthPageRoutingModule
  ],
  declarations: [RequestAuthPage]
})
export class RequestAuthPageModule {}
