import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afs: AngularFirestore,
    private storage: Storage,
    public router: Router,
    //public onlineOffline: boolean = navigator.onLine,
  ) {
    this.initializeApp();
    /*
    window.addEventListener('offline', () => {
      console.log('No internet')
    });
    */
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        // Get FCM Token
        this.storage.get('user').then(user => {
          if (user) {
            this.router.navigate(['home'])
          } else {
            this.router.navigate(['login'])
          }
        })
      }
    });
  }

}
