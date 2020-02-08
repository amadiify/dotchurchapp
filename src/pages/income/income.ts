import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { FooterProvider } from '../../providers/footer/footer';
import { Storage } from '@ionic/storage';
import { BudgetsPage } from '../budgets/budgets';


@IonicPage()
@Component({
  selector: 'page-income',
  templateUrl: 'income.html',
})
export class IncomePage {
  income : any;
  incomes : any;
  footer : any;
  avatar : any;
  churchid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl : AlertController, public loader : LoadingController,
  public http : Http, public footerCtrl : FooterProvider,
  public storage : Storage) {
    this.income = new Function();
    this.income.total = 0; 

    this.footer = this.footerCtrl.footer;

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

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.gettotal().subscribe(res => {
        var total = 0;
  
        for (var d in res)
        {
          if (Number(res[d].amount) >= 0)
          {
            total += Number(res[d].amount);
          }
          
        }
  
        this.income.total = total;
        
      }, error => {
        this.income.total = 0;
      });
      this.loadincome().subscribe(res => {
  
        var data = [];
  
        if (typeof res.status != "undefined")
        {
          data.push(res);
        }
        else
        {
          data = res;
        }
  
        this.incomes = data;
      });

    });

    
  }

  ionViewDidLoad() {
  }

  callagain()
  {
    this.gettotal().subscribe(res => {
      var total = 0;

      for (var d in res)
      {
        if (Number(res[d].amount) >= 0)
        {
          total += Number(res[d].amount);
        }
        
      }

      this.income.total = total;
      
    }, error => {
      this.income.total = 0;
    });
    this.loadincome().subscribe(res => {

      var data = [];

      if (typeof res.status != "undefined")
      {
        data.push(res);
      }
      else
      {
        data = res;
      }

      this.incomes = data;
    });
  }

  gettotal()
  {
    return this.http.get( MyApp.app_api + "titheoffering/-w givingtype = 'Offering' and recorded = 0 or givingtype = 'Tithe' and recorded = 0 and churchid ="+this.churchid).map(res => res.json());
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

  sum()
  {
    var args = arguments;
    var sum = 0;

    for (var a in args)
    {
      sum += Number(args[a]);
    }

    return sum;
  }

  addincome()
  {
    if ( "total" in this.income )
    {
        if (Number(this.income.total) > 0)
        {
          var loading = this.loader.create({
            content: "Submitting income",
            duration: 400000,
            dismissOnPageChange: true
          });

          loading.present();

          var formdata = new FormData();

          for (var d in this.income)
          {
            if (d == "total"){ 
              d = "titheoffering"; 
              formdata.append("income["+d+"]", this.income["total"]);
            }
            else
            {
              formdata.append("income["+d+"]", this.income[d]);
            }
            
          }

          this.http.post( MyApp.sermon_api + 'addincome/'+this.churchid, formdata).map(res => res.json())
          .subscribe(res => {
            loading.dismiss();

            if (res.status == "success")
            {
              this.say({
                title : 'Success',
                message: "Income added successfully.",
                button : ['Ok']
              });

              

              var inputs = document.querySelectorAll("input");
              //inputs = [].slice.call(inputs);

              [].forEach.call(inputs, function(e){
                e.value = "";
              });

              this.callagain();
            }
            else
            {
              this.say({
                title : 'Cannot proceed',
                message: "Please try again. server down.",
                button : ['Ok']
              });
            }
          });
        }
        else
        {
            this.say({
              title : 'Cannot proceed',
              message: "No income received",
              button : ['Ok']
            });
        }
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

  loadincome()
  {
    return this.http.get( MyApp.app_api + 'income/-w churchid = '+this.churchid+' -o daterecorded desc').map(res => res.json() );
  }

}
