import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PastorsProvider } from '../../providers/pastors/pastors';
import { pastorModel } from '../../models/pastorsModel';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { PastorInfoPage } from "../pastor-info/pastor-info";
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { FooterProvider } from '../../providers/footer/footer';


@IonicPage()
@Component({
  selector: 'page-pastor-desk',
  templateUrl: 'pastor-desk.html',
})
export class PastorDeskPage {

  pastors : pastorModel[];
  myapp : any;
  Myapp : any;
  image = MyApp.app_image;
  avatar : any;
  footer : any;
  defaultimage = "";
  churchid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public pastorPrc : PastorsProvider, public loading : LoadingController, 
    public viewcnt : ViewController,
    private storage : Storage, public footerCtrl : FooterProvider) {

    this.storage.get("churchid").then((id) => {
      this.churchid = id;
      this.loadAll(id);
    });
   

    this.footer = footerCtrl.footer;
    
    this.storage.get("user").then((row) => {
      this.defaultimage = '../assets/imgs/men3.jpg';
      if (row.avatar == "hello.png")
      {
        this.avatar = this.Myapp.defaultimage;
      }
      else{
        this.avatar = this.image + row.avatar;
      }
    });

    
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

  loadAll(id){
    this.pastorPrc.loadAll(id).subscribe( res => {
      this.pastors = res;
    });
  }

  loader(){
    this.loading.create({
      content: 'Collecting List',
      duration: 500
    }).present();
  }

  loader2(name: string){
    this.loading.create({
      content: name + ' Desk Opening ',
      duration: 40000,
      dismissOnPageChange: true
    }).present();
  }
  
  showPastor(person:any){
    this.loader2(person.fullname);
    this.navCtrl.push(PastorInfoPage, {person});
  }

  getItems(ev: any) {

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.pastors = this.pastors.filter((item, indx) => {
        return (item.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

    if (this.pastors.length == 0 || val == "")
    {
      this.loader();
      this.loadAll(this.churchid);
    }
  }

  ionViewDidLoad() {
    this.myapp = MyApp.app_image;
    this.Myapp = MyApp;
  }

  ionViewWillLoad(){
    this.viewcnt.showBackButton(true);
  }

}
