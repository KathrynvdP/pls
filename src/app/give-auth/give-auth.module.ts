import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiveAuthPageRoutingModule } from './give-auth-routing.module';

import { GiveAuthPage } from './give-auth.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignaturePadModule,
    GiveAuthPageRoutingModule
  ],
  declarations: [GiveAuthPage]
})
export class GiveAuthPageModule {}
