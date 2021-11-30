import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public loginForm: FormGroup;
  public password: FormControl = new FormControl('', Validators.required);

  constructor(public loading: LoadingService, private authService: AuthenticationService, public platform: Platform, public alertCtrl: AlertController, public router: Router) {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  login() {
    this.loading.present('Authenticating Please Wait').then(() => {
      this.email = this.loginForm.get('email').value.trim();
      this.password = this.loginForm.get('password').value.trim();
      this.authService.login(this.email, this.password)
        .then(res => {
          this.loading.dismiss();
        }).catch(err => {
          this.loading.dismiss().then(() => {
            this.presentAlert(err);
          });
        });
    });
  }

  async presentAlert(err) {
    const alert = await this.alertCtrl.create({
      header: 'Uhh ohh...',
      subHeader: 'Something went wrong',
      message: err.message,
      buttons: ['OK']
    });
    return await alert.present();
  }

}


