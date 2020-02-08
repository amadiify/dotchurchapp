import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { BudgetsPage } from '../budgets/budgets';


@IonicPage()
@Component({
  selector: 'page-departmenthead',
  templateUrl: 'departmenthead.html',
})
export class DepartmentheadPage {

  footer : any;
  budget : any;
  budgets : any;
  departments : any;
  avatar : any;
  churchid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, public http : Http, public loader : LoadingController,
  public alertCtrl : AlertController, public storage : Storage) {
    this.footer = this.footerCtrl.footer;
    this.budget = new Function();

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.loadbudgets().subscribe(res => {
        
        var data:any = [];

        var obj = res.trim();
        obj = JSON.parse(obj);

      

        if (obj.length > 1)
        {
          data = obj;
        }
        else
        {
          data.push(obj);
        }

        
        this.budgets = data;
      });
  
      this.loaddepartments().subscribe( res => {

        var data:any = [];

        var obj = res.trim();
        obj = JSON.parse(obj);

      

        if (obj.length > 1)
        {
          data = obj;
        }
        else
        {
          data.push(obj);
        }

        this.departments = data;
        
      });

      
    });

    
    this.storage.get("user").then( (row) => {
      if (row !== null)
      {
        if (row.avatar != "hello.png")
        {
          this.avatar = row.avatar;
        }
        else
        {
          this.avatar = MyApp.defaultImage;
        }
        
      }
    });

    
  }

  ionViewDidLoad() {
    console.log(MyApp.app_api);
  }

  loadbudgets()
  {
    return this.http.get(MyApp.app_api + 'departmenthead/-w allocated > 0 and churchid ='+this.churchid).map( res => res.text() );
  }

  minus(num, num2)
  {
    return Number(num) - Number(num2);
  }

  loaddepartments()
  {
    return this.http.get( MyApp.app_api + 'departments/-w churchid = '+this.churchid+' -o department asc').map( res => res.text() );
  }

  allocate()
  {
    var formdata = new FormData();

    var data = this.budget;

    if ("amount" in data && Number(data.amount) > 0)
    {
        if ('department' in data)
        {
          for (var x in data)
          {
            formdata.append("allocate["+x+"]", data[x]);
          }

          var loading = this.loader.create({
            content: "Submitting budget",
            duration: 400000,
            dismissOnPageChange: true
          });

          loading.present();

          this.http.post( MyApp.sermon_api + 'allocate/'+this.churchid, formdata).map(res => res.json())
          .subscribe( res => {
            loading.dismiss();

            if (res.status == "success")
            {
              this.say({
                title: "Success",
                message: "Allocated was successful",
                button: ['Ok']
              }); 

              this.navCtrl.setRoot(this.navCtrl.getActive().component);
              
              this.budget = new Function();

              this.loadbudgets().subscribe(res => {
                this.budgets = res;
              });

              var fda = document.querySelector("*[data-at]");

              [].forEach.call(fda, (ele) => {
                ele.value = "";
              });
            }
            else
            {
              this.say({
                title: "Error",
                message: "Allocation failed. Please try again",
                button: ['Ok']
              }); 
            }
          });
        }
        else
        {
          this.say({
            title: "Invalid data",
            message: "No department selected",
            button: ['Ok']
          }); 
        }
    }
    else
    {
      this.say({
        title: "Invalid data",
        message: "No amount inputed",
        button: ['Ok']
      });
    }
  }

  say(message)
  {
    this.alertCtrl.create({
      title: message.title,
      subTitle: message.message,
      buttons: message.button
    }).present();
  }

  goback(){
    if(this.navCtrl.length() >= 1)
    {
      this.navCtrl.pop();
    }
    else
    {
      this.navCtrl.setRoot(BudgetsPage);
    }
  }

}
