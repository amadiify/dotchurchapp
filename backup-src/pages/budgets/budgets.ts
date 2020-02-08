import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { IncomePage } from '../income/income';
import { ExpenditurePage } from '../expenditure/expenditure';
import { DepartmentheadPage } from '../departmenthead/departmenthead';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-budgets',
  templateUrl: 'budgets.html',
})
export class BudgetsPage {

  footer:any;
  avatar : any;
  role : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, public storage : Storage) {

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


        var role:any = "";

        if ('role' in row)
        {
          role = row.role.toLowerCase();
        }
        else
        {
          role = "admin";
        }
        
        
        this.role = role;
        
      }
   });
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BudgetsPage');
  }

  income()
  {
    this.navCtrl.push(IncomePage)
  }

  expenditure()
  {
    this.navCtrl.push(ExpenditurePage);
  }

  department()
  {
    this.navCtrl.push(DepartmentheadPage);
  }
}
