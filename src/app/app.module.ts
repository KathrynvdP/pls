import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { ToastService } from './services/toast.service';
import { ConnectionService } from './services/connection.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { AddItemPageModule } from './add-item/add-item.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { ZBar } from '@ionic-native/zbar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { EditAccountPageModule } from './edit-account/edit-account.module';
import { UpdateItemPageModule } from './update-item/update-item.module';
import { GiveAuthPageModule } from './give-auth/give-auth.module';
import { AgmCoreModule } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverComponent } from './popover/popover.component';
import { HttpClientModule } from '@angular/common/http';
import {EventService} from '../app/services/event.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@NgModule({
  declarations: [AppComponent, PopoverComponent],
  entryComponents: [PopoverComponent],
  imports: [
     BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    EditAccountPageModule,
    UpdateItemPageModule,
    GiveAuthPageModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot(),
    AddItemPageModule,
    IonicSelectableModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQyBk6S7DPRrPeB926Viip9mYlcUjsQB8'
    }), 
  ],
  providers: [
    AuthGuardService,
    AuthenticationService,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    ToastService,
    ConnectionService,
    ZBar,
    Geolocation,
    FirebaseX,
    EventService,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
