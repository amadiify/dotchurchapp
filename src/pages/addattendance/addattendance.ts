import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-addattendance',
  templateUrl: 'addattendance.html',
})
export class AddattendancePage {

  program : string;
  footer : any;
  data : object;
  logo : string;
  churchid : any;
  userid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, public alertCtrl : AlertController,
  public loader : LoadingController, public http : Http, public storage : Storage) {
    this.program = this.navParams.get("program");
    this.footer = this.footerCtrl.footer;
    this.data = new Function();
    this.logo = "assets/imgs/logoe.png";

    this.storage.get('churchid').then(res => {
      this.churchid = res;
    });

    this.storage.get('userid').then(res => {
      this.userid = res;
    });


  }

  register(data)
  {
    if ("men" in data && "women" in data && "children" in data && "pastors" in data && "ministers" in data)
    {
        var formdata = new FormData();

        formdata.append("attend[program]", this.program);
        formdata.append("attend[churchid]", this.churchid);
        formdata.append("attend[addedby]", this.userid);
        
        for (var xx in data)
        {
          formdata.append('attend['+xx+']', data[xx]);
        }

        var loader = this.loader.create({
          content : '',
          duration: 40000,
          enableBackdropDismiss: false,
          dismissOnPageChange: true
        });

        loader.present();

        this.http.post(MyApp.sermon_api + 'addattendance', formdata).map(res => res.json())
        .subscribe(res => {
          loader.dismiss();

          if (res.status == "success")
          {
            this.message("Success", "Attendance recorded successfully", true);
          }
          else
          {
            this.message("Failed", "Please try again later, insert error.");
          }

        });
    }
    else
    {
        this.message("Form Error", "All fields are required!");
    }
  }

  message(title, note, extra = false)
  {

    if (extra == true)
    {
      this.alertCtrl.create({
        title : title,
        subTitle : note,
        buttons : [
          {
            text : 'Ok',
            role : 'continue',
            handler : () => {
              var inputs = document.querySelectorAll('[type="text"]');

              if (inputs.length > 0)
              {
                [].forEach.call(inputs, (e) => {
                  e.value = "";
                });
              }
            }
          }
        ]
      }).present();
    }
    else
    {
      this.alertCtrl.create({
        title : title,
        subTitle : note,
        buttons : ['Ok']
      }).present();
    }
    
  }

  ionViewDidLoad() {
  }

}
