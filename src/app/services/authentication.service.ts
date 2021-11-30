import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';

@Injectable()
export class AuthenticationService {

  authState = new BehaviorSubject(false);
  userId;

  constructor(
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    public toastController: ToastController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.storage.get('user').then((user) => {
      if (user) {
        this.authState.next(true);
      }
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  reset(email) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.sendPasswordResetEmail(email).then(() => {
        resolve();
      }),
        err => reject(err)
    });
  }

  login(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(
          res =>
            this.afAuth.authState.pipe(take(1)).subscribe(auth => {
              if (auth && auth.uid) {
                this.afs.collection('users').doc(auth.uid).ref.get().then((user: any) => {
                  console.log(user.data().type);
                  this.storage.set('user', user.data()).then(() => {
                    this.authState.next(true);
                    this.router.navigate(['home']);
                    resolve(res);
                  });
                });
              }
            }),
          err => reject(err));
    });
  }

  userObjectSignIn(auth) {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('users').doc(auth.uid).ref.get().then((doc) => {
        this.storage.set('user', doc.data()).then(() => {
          this.authState.next(true);
          this.router.navigate(['home']);
          resolve();
        });
      });
    });
  }

  logout() {
    return new Promise<void>((resolve, reject) => {
      if (this.afAuth.currentUser) {
        // this.presence.signOut().then(() => {
        this.storage.remove('user').then(() => {
          this.router.navigate(['login']).then(() => {
            this.afAuth.signOut().then(() => {
              this.authState.next(false);
              resolve();
            });
          }).catch((error) => {
            reject(error);
          });
        });
        // })
      }
    });
  }

}
