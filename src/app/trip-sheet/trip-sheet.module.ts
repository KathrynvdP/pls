import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TripSheetPageRoutingModule } from './trip-sheet-routing.module';
import { TripSheetPage } from './trip-sheet.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripSheetPageRoutingModule,
    IonicSelectableModule,
    GooglePlaceModule
  ],
  declarations: [TripSheetPage]
})
export class TripSheetPageModule {}
