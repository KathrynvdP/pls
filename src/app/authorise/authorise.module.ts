import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorisePageRoutingModule } from './authorise-routing.module';

import { AuthorisePage } from './authorise.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    AuthorisePageRoutingModule
  ],
  declarations: [AuthorisePage]
})
export class AuthorisePageModule {}
