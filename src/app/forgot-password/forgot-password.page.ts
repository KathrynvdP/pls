import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public forgotPasswordForm: FormGroup;
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(public navCtrl: NavController, private authService: AuthenticationService, public loading: LoadingService, public alertCtrl: AlertController) {
    
   }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: this.email
    });
  }

  public requestReset(): void {
    let email = this.forgotPasswordForm.get('email').value.trim();
    this.loading.present('Generating Reset Link...').then(() => {
      this.authService.reset(email).then(() => {
        this.loading.dismiss().then(() => {
          return this.resetNotification()
        })
      }).catch(err => {
        this.loading.dismiss().then(() => {
          return this.error(err)
        })
      })
    })
  }

  async resetNotification() {
    const alert = await this.alertCtrl.create({
      header: 'Request Sent',
      subHeader: 'An email with a password reset link has been sent to you',
      message: 'Go to your email inbox, follow the instructions, and change the password of your account.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateRoot('/login');
        }
      }]
    })
    return await alert.present();
  }

  async error(err) {
    const alert = await this.alertCtrl.create({
      header: 'Uhh ohh...',
      subHeader: 'Something went wrong',
      message: err.message,
      buttons: ['OK']
    })
    return await alert.present();
  }

}
