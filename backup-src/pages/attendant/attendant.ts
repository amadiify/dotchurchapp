import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { FooterProvider } from '../../providers/footer/footer';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
import { Http } from '@angular/http';
import { MemberslistPage } from '../memberslist/memberslist';


@IonicPage()
@Component({
  selector: 'page-attendant',
  templateUrl: 'attendant.html',
})
export class AttendantPage {

  footer : any;
  avatar : any;
  image = MyApp.app_image;
  members : any;
  role : any;
  Myapp = MyApp;
  programs = [];
  defaultimage = "";
  churchid : any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, private storage : Storage,
  public http : Http, public modalCtrl : ModalController) {

    this.footer = footerCtrl.footer;

    this.storage.get("user").then((row) => {

      this.defaultimage = '../assets/imgs/men3.jpg';
      if (row.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else{
        this.avatar = this.image + row.avatar;
      }
      
      this.role = row.role;
    });

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.getPrograms().subscribe(res => {
        var data = [];

        if ("status" in res)
        {
          data.push(res);
        }
        else
        {
          for(var x in res)
          {
            data.push(res[x]);
          }
        }
        
        this.programs = data;
      });
      
    });

    
  }

  getPrograms()
  {
    return this.http.get( this.Myapp.app_api + 'programs/-w churchid ='+this.churchid).map( res => JSON.parse(res.text().trim()));
  }

  loadmembers(program)
  {
    var members = this.getMembers(program);

    this.modalCtrl.create(MemberslistPage, {program, members}).present();
  }

  getMembers(program)
  {
    var query = this.Myapp.sermon_api;
    return this.http.get( query + 'members/'+program.program+'/'+this.churchid).map(res => res.text());
  }

  ionViewDidLoad() {
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
