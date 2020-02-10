import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppUsers } from '../../providers/app-users/app-users';
import { MyApp } from '../../app/app.component';
import { LoginPage } from '../login/login';
import { RegistrationPage } from '../registration/registration';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the QrcodepaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qrcodepayment',
  templateUrl: 'qrcodepayment.html',
})
export class QrcodepaymentPage {
  logo : any = '';
  scanned : boolean = false;
  form : any = {};
  churchname : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner,
    private alertC : AlertController, private Loading : LoadingController, private http : Http,
    private appuser: AppUsers,
    private iab: InAppBrowser,
	  private platform: Platform) {
    this.logo = 'assets/imgs/logoe.png';
  }

  ionViewDidLoad() {
  }

  scancode()
  {
      this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
          if (status.authorized) {
            // camera permission was granted


            // start scanning
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              
              if (text.indexOf('payto/') > 10)
              {
                  this.scanned = true;
                  this.getInformation(text);
              }
              else
              {
                 this.alertC.create({
                   title : 'Invalid QRCode',
                   subTitle : "The QRCode you scanned doesn't belong to any registered church on this platform.",
                   buttons : ["Ok"]
                 }).present();
              }

              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
            });

          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            this.qrScanner.openSettings();
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
          }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  loading(){
    return this.Loading.create({
      content: "",
      dismissOnPageChange: false,
      duration: 40000,
      enableBackdropDismiss: false
    });
  }

  getInformation(url:string)
  {
    var loader = this.loading();
    
    loader.present();

    url += '?mobile-app=true';

    var getinfo = this.http.get(url).map(res => res.json());

    getinfo.subscribe(res => {

      loader.dismiss();
      if (res.status == 'success')
      {
         this.churchname = res.churchname;
         this.scanned = true;
      }

    });
  }

  processPayment(form:any)
  {
    if (form.username != '' && form.password != '')
    {
        this.form = form;

        // verify authencity
        this.login((info:any, churchid:any)=>{
          if (form.type != null && form.amount !== null && form.idno !== null) {
            if (form.type == "other") {
              form.type = form.specify;
            }
      
            var formdata = "";
      
            var loader = this.Loading.create({
              content: 'Contacting Dotchurch...',
              duration: 40000,
              dismissOnPageChange: false,
              enableBackdropDismiss: false
            });
      
            if (parseInt(form.amount) > 0) {
              formdata += "givingtype=" + form.type;
              formdata += "&amount=" + form.amount;
              formdata += "&memberid=" + info.memberid;
              formdata += "&churchid=" + churchid;
              formdata += "&giftaid=" + form.giftaid;
              formdata += "&idno=" + form.idno;
      
              loader.present();
      
              setTimeout(() => {
      
                this.platform.ready().then(() => {
      
                  loader.dismiss();

                  this.iab.create(MyApp.sermon_api + 'NewPayment?' + formdata, "_system");
      
                });
      
              }, 2000);
      
            }
            else {
              this.alertC.create({
                title: "Invalid Amount",
                subTitle: "Amount must be numeric",
                buttons: ['Ok']
              }).present();
            }
      
          }
          else {
            this.alertC.create({
              title: "All fields are required",
              subTitle: "Please enter all fields correctly",
              buttons: ['Ok']
            }).present();
          }
        });
    }
  }

  login(callback):any {

    var loader = this.loading();
    
    loader.present();
    this.appuser.validUser(this.form.username, this.form.password)
    .subscribe(res => {

      var getreport = false;
      var status = false;
 
      if(res)
      {
        for (var ge in res)
        {
          if(ge == "status")
          {
            getreport = true;

            if (res[ge] == "success")
            {
              status = true;
            }

            break;
          }
        }
      }

      if (getreport === true)
      {
          if (status == false)
          {
            this.form.username = "";
            this.form.password = "";

            this.wrongLogin();
            loader.dismissAll();
          }
          else
          {

            var churchid = parseInt(res.churchid);

            let login = this.userinfo(res.userid);
            
            login.subscribe( info => {
              loader.dismiss();
              // info.memberid, churchid
              callback.call(this, info, churchid);
            });
            
          }
      }

    }, error => {
      if(error.ok == false && error.status == 0 )
      {

        this.alertC.create({
          title: "No network connection",
          subTitle: "Failed to login, please check your internet connection then try again.",
          buttons: [
            {
              text: "OK",
              handler: () => {
                loader.dismissAll();
              }
            }
          ]
        }).present();
      }
    });
  }

  wrongLogin(){
    this.alertC.create({
      title: "Login Failed",
      subTitle: "Username/password provided not valid or account not activated. Please try again",
      buttons: ['Ok']
    }).present();
  }

  userinfo(id:Number)
  {
    return this.http.get(MyApp.app_api + 'members/-w userid =' + id).map(res => res.json());
  }

  gotologin()
  {
      this.navCtrl.push(LoginPage);
  }

  gotoregister()
  {
    this.navCtrl.push(RegistrationPage);
  }

}
