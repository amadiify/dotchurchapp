import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  data : any;
  addprofile = false;
  complete = false;
  logo : any;
  loading : any;
  churches : any;
  departments : any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl : AlertController, public http : Http, public loader : LoadingController) {
    this.data = new Function();
    this.logo = 'assets/imgs/logoe.png';

    this.loading = this.loader.create({
      content: "Please wait..",
      duration: 40000,
      dismissOnPageChange: false,
      enableBackdropDismiss: false
    });

    this.loading.present();

    this.getchurches().subscribe(res => {
      
      if (res)
      {
        if (res.status)
        {
          // one data returned
          var data = [];

          data.push(res);

          this.churches = data;
        }
        else
        {
          this.churches = res;
        }
        this.loading.dismiss();
      }
    });


  }

  getchurches()
  {
    let query = this.http.get( MyApp.app_api + 'churches/-o churchid asc').map(res => res.json());
    return query;
  }

  ionViewDidLoad() {

     
  }

  register(data)
  {
    var contin = true;

    if(data.churchid && data.fullname && data.email && data.occupation)
    {
      this.getdepartments(data.churchid);
      contin = true;
    }
    else
    {
      contin = false;
    }

    if(contin == false)
    {
      this.alertCtrl.create({
        title: "Missing fields",
        subTitle : "All fields are required please..",
        buttons:['Ok']
      }).present();
    }
    else
    {
      this.addprofile = true;
    }
  }

  login()
  {
    var data = true;
    this.navCtrl.push(HomePage, {data});
  }

  backProfile()
  {
    this.addprofile = false;
  }

  getdepartments(id)
  {
     var get = this.http.get(MyApp.sermon_api + 'departments/' + id).map(res => res.json());
     get.subscribe(res => {

       if ('status' in res){}else{
        this.departments = res;
       }
     });
  }

  completeReg(data)
  {
    if("username" in data && "password" in data)
    {
        var formdata = new FormData;

        if( data.indepartment == 'no')
        {
          data.role = "member";
        }

        for(var x in data)
        {
          formdata.append("register["+x+"]", data[x]);
        }

        let loading = this.loader.create({
          content: "Creating account",
          duration: 40000,
          dismissOnPageChange: true
        });


        loading.present();

        this.http.post( MyApp.sermon_api + 'register', formdata).map(res => res.json())
        .
        subscribe(res => {
            if(res.status == 'success')
            {
              loading.dismiss();
              
              this.alertCtrl.create({
                title: "Account Registered",
                subTitle: "Your account has been registered successfully. Account would be activated after Admin approval. ",
                buttons: [
                  {
                    text: 'Ok',
                    role: 'login',
                    handler : () => {
                      this.login(); 
                    }
                  }
                ]
              }).present();
            }
        }, error => {
          this.alertCtrl.create({
            title: "Something went wrong!",
            subTitle: "Check your internet connectivity",
            buttons: ['Ok']
        }).present();

          loading.dismiss();
        }); 
    }
    else
    {
      this.alertCtrl.create({
          title: "Missing data",
          subTitle: "Username and password required",
          buttons: ['Ok']
      }).present();
    }
  }

  goback()
  {
    if(this.navCtrl.canGoBack() == true)
    {
      this.navCtrl.pop();
    }
    else
    {
      this.navCtrl.insert(0, DashboardPage);
      this.navCtrl.pop();
    }
  }

}
