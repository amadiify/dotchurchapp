import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';

import { userlogin } from '../../models/userLogin';

import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { RegistrationPage } from '../registration/registration';
import { LoginPage } from '../login/login';
import { QrcodepaymentPage } from '../qrcodepayment/qrcodepayment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  slides:string[] = ['../../assets/imgs/app-screen1.jpg', '../../assets/imgs/app-screen4.jpg']
  user:userlogin = new userlogin();
  errorMessage:string = "";
  firstTime = true;
  data : any;
  logo : any;

  static appPages: Array<{title:string, component:any}>;

  constructor(public navCtrl: NavController, public navparam : NavParams,
  private storage : Storage, public ActionSheet : ActionSheetController) {
  
  this.logo = 'assets/imgs/logoe.png';
  var loginf = navparam.get("data");

  if(MyApp.notloggedin == true)
  {
      var pages = [];
      pages[0] = {title: "Home Screen", component: HomePage};
      pages[1] = {title: "Create Account", component:RegistrationPage};
      pages[2] = {title: "Account Login", component:LoginPage};

      HomePage.appPages = pages;
  }
  else
  {
    HomePage.appPages = [];
  }
    if(loginf == true)
    {
      this.firstTime = false;
    }
    else
    {
      this.storage.get("user").then((res) => {
  
        this.ActionSheet.create({
          title: "Welcome back ",
          buttons: [
            {
              text: "Login",
              role: "login",
              handler: () => {

                this.navCtrl.push(LoginPage);

                this.storage.get("username").then( (user) => {
                  this.user.username = user;

                  
                
                });
              }
            },
  
            {
              text: "Register",
              role: 'register',
              handler: () => {
                this.navCtrl.push(RegistrationPage);
              }
            }
            ,
            {
              text: "Scan QRCode to Give",
              role:"quick-giving",
              handler: () => {
                this.navCtrl.push(QrcodepaymentPage);
              }
            }
          ]
        }).present();
  
      }).catch((err) => {
        this.firstTime = true;
      });
    }
  
  }

  loginpage()
  {
    this.navCtrl.push(LoginPage);
  }

  register()
  {
    this.navCtrl.push(RegistrationPage);
  }

  

}
