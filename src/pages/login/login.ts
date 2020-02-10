import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { AppUsers } from '../../providers/app-users/app-users';
import { RegistrationPage } from '../registration/registration';
import { ResetPage } from '../reset/reset';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginpinPage } from '../loginpin/loginpin';
import { QrcodepaymentPage } from '../qrcodepayment/qrcodepayment';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user : any;
  logo : any;

  static appPages: Array<{title:string, component:any}>;

  constructor(public navCtrl: NavController, public navparam : NavParams, 
    private appuser: AppUsers,
  private alertC : AlertController, private Loading : LoadingController,
  private storage : Storage,  public ActionSheet : ActionSheetController,
  private http : Http) {
    this.logo = 'assets/imgs/logoe.png';
    this.user = new Function();

    this.storage.get("username").then( (user) => {
      this.user.username = user;
    });

  }

  loading(){
    return this.Loading.create({
      content: "",
      dismissOnPageChange: true,
      duration: 40000,
      enableBackdropDismiss: true
    });
  }
  

  wrongLogin(){
    this.alertC.create({
      title: "Login Failed",
      subTitle: "Username/password provided not valid or account not activated. Please try again",
      buttons: ['Ok']
    }).present();
  }

  loginpin():any
  {
    var loader = this.loading();
    
    loader.present();

    this.appuser.validUser(this.user.username, this.user.password)
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


        if (getreport === true)
        {
            if (status == false)
            {
              this.user.username = "";
              this.user.password = "";

              this.wrongLogin();
              loader.dismissAll();
            }
            else
            {
              let login = this.userinfo(res.userid);

              login.subscribe( info => {

                let pin = res.pin;

                var churchid = parseInt(res.churchid);

                DashboardPage.loadedData = "";
                DashboardPage.liverefresh = false;
                DashboardPage.loadedChurchData = "";
                DashboardPage.loadedProgram = "";
                DashboardPage.loaded = false;

                MyApp.session_id = info.memberid;
                MyApp.loggedin_user = info;
                MyApp.notloggedin = false;

                this.storage.set("churchid", churchid);
                this.storage.set("user", info);
                this.storage.set("memberid", info.memberid);
                this.storage.set("userid", info.userid);
                this.storage.set("username", this.user.username);

                this.appuser.navigation(res.role).subscribe( nav => { 
                  let allpages = [];
                  var lop = 0;
    
                  for ( var ap in nav)
                  {
                    if (nav[ap] != 'success')
                    {
                      allpages[lop] = {title: nav[ap]['navTitle'], 
                      component: MyApp.regPages[nav[ap]['navTitle']]};
                      lop += 1;
                    }
                  
                  }
                  
                  HomePage.appPages = allpages;
                  MyApp.userRole = res.role;
                  this.storage.set("role", res.role);
    
                  if (churchid != 0)
                  {
                    if (res.role.toLowerCase()  != "admin" && res.role.toLowerCase()  != "pastor" )
                    {
                      this.navCtrl.push(DashboardPage, {res});
                    }
                    else
                    {
                      loader.dismissAll();
                    }
                    
                  }
                  else
                  {
                    this.alertC.create({
                      title: "Church not found",
                      subTitle: "Sorry we can't log you in. Church not registered",
                      buttons: ['Ok']
                    }).present();
    
                    loader.dismissAll();
    
                  }
                  
                });

                if (res.role.toLowerCase()  == "admin" || res.role.toLowerCase() == "pastor")
                {
                  var data = this.user;
                  this.navCtrl.push(LoginpinPage, {data,pin,res});
                }

                

              });

            }
        }

      }

    });

  }

  forget()
  {
      this.navCtrl.push(ResetPage);
  }

  login():any {


    var loader = this.loading();
    
    loader.present();
    this.appuser.validUser(this.user.username, this.user.password)
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
            this.user.username = "";
            this.user.password = "";

            this.wrongLogin();
            loader.dismissAll();
          }
          else
          {

            var churchid = parseInt(res.churchid);

            DashboardPage.loadedData = "";
            DashboardPage.liverefresh = false;
            DashboardPage.loadedChurchData = "";
            DashboardPage.loadedProgram = "";
            DashboardPage.loaded = false;

            let login = this.userinfo(res.userid);
            
            login.subscribe( info => {
              
              MyApp.session_id = info.memberid;
              MyApp.loggedin_user = info;
              MyApp.notloggedin = false;
              MyApp.churchid = churchid;

              this.storage.set("churchid", churchid);
              this.storage.set("user", info);
              this.storage.set("memberid", info.memberid);
              this.storage.set("userid", info.userid);
              this.storage.set("username", this.user.username);
              

            });

            this.appuser.navigation(res.role).subscribe( nav => { 
              let allpages = [];
              var lop = 0;

              for ( var ap in nav)
              {
                if (nav[ap] != 'success')
                {
                  allpages[lop] = {title: nav[ap]['navTitle'], 
                  component: MyApp.regPages[nav[ap]['navTitle']]};
                  lop += 1;
                }
              
              }
              
              HomePage.appPages = allpages;
              MyApp.userRole = res.role;
              this.storage.set("role", res.role);

              if (churchid != 0)
              {
                this.navCtrl.push(DashboardPage, {res});
              }
              else
              {
                this.alertC.create({
                  title: "Church not found",
                  subTitle: "Sorry we can't log you in. Church not registered",
                  buttons: ['Ok']
                }).present();

                loader.dismissAll();

              }
              
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

  register()
  {
    this.navCtrl.push(RegistrationPage);
  }

  userinfo(id:Number)
  {
    return this.http.get(MyApp.app_api + 'members/-w userid =' + id).map(res => res.json());
  }

  qrcode()
  {
      this.navCtrl.push(QrcodepaymentPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
