import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { FooterProvider } from '../../providers/footer/footer';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-envelope',
  templateUrl: 'envelope.html',
  styles:[
    ''
  ]
})
export class EnvelopePage {

  footer : any;
  avatar : any;
  defaultimage : any;
  image = MyApp.app_image;
  envelope : any;
  footerCtrl : any;
  clicked : boolean = false;
  memberid : any;
  churchid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
     public storage : Storage, public Modal : ModalController, 
     public ActionSheet : ActionSheetController, 
     public loader : LoadingController,
     public http : Http,
     public alertCtrl : AlertController,
     private iab: InAppBrowser) {
    
    this.envelope = new Function();
    this.footerCtrl = new FooterProvider(Modal, ActionSheet);
    this.footer = this.footerCtrl.footer;
    this.clicked = this.navParams.get("clicked") || false;

    

    this.defaultimage = '../assets/imgs/men3.jpg';

    storage.get("user").then((row) => {
      if (row.avatar == "hello.png" )
      {
        this.avatar = MyApp.defaultImage;
      }
      else{
        this.avatar = this.image + row.avatar;
      }

      this.memberid = row.memberid;
      
    });

    storage.get("churchid").then((id) => {
      this.churchid = id;
    });
  }

  ionViewDidLoad() {
  }

  processPayment(envelope)
  {

    if (envelope.type != null && envelope.amount !== null && envelope.idno !== null)
    {
      if (envelope.type == "other")
      {
        envelope.type = envelope.specify;
      }

      var formdata = "";

      var loader = this.loader.create({
        content: 'Contacting Dotchurch...',
        duration: 40000,
        dismissOnPageChange: false,
        enableBackdropDismiss: false
      });

      if (parseInt(envelope.amount) > 0)
      {
        formdata += "givingtype="+envelope.type;
        formdata += "&amount="+envelope.amount;
        formdata += "&memberid="+this.memberid;
        formdata += "&churchid="+this.churchid;
        formdata += "&giftaid="+envelope.giftaid;
        formdata += "&idno="+envelope.idno;
        
        loader.present();

        setTimeout(() => {
          loader.dismiss();

          var inputs = document.querySelectorAll("input");

          [].forEach.call(inputs, (e)=>{
            e.value = "";
          });

          var select = document.querySelectorAll("select");

          [].forEach.call(select, (e) => {
            e.selected = "";
            e.value = "";
          });
          this.iab.create(MyApp.sermon_api + 'NewPayment?' + formdata.toString(), "_system");
        }, 2000);
        
      }
      else
      {
        this.alertCtrl.create({
          title: "Invalid Amount",
          subTitle: "Amount must be numeric",
          buttons : ['Ok']
        }).present();
      }
      
    }
    else
    {
      this.alertCtrl.create({
        title: "All fields are required",
        subTitle: "Please enter all fields correctly",
        buttons : ['Ok']
      }).present();
    }
    
  }

  goback()
  {
    
    if (this.clicked === true)
    {
      this.navCtrl.setRoot(DashboardPage);
    }
    else
    {
      var apr = document.querySelector(".app-root");
      var modal : any = apr.querySelectorAll('ion-modal[class=show-page]');  
      [].forEach.call(modal, function(me){
        if (me.hasAttribute("data-is-hidden"))
        {
          apr.removeChild(me);
        }
        else
        {
          me.style.display = "none";
          me.setAttribute("data-is-hidden", 'true');
        }
      });
    }
     
  }

}
