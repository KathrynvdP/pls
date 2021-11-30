import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SecurityCheckPageRoutingModule } from './security-check-routing.module';
import { SecurityCheckPage } from './security-check.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SecurityCheckPageRoutingModule
  ],
  declarations: [SecurityCheckPage]
})
export class SecurityCheckPageModule {}
