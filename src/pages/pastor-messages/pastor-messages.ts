import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController,
ModalController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { FooterProvider } from '../../providers/footer/footer';
import { ReadmessagePage } from '../../pages/readmessage/readmessage';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-pastor-messages',
  templateUrl: 'pastor-messages.html',
})
export class PastorMessagesPage {

  messages : any;
  randNum : Number;
  userid = MyApp.session_id;
  footer : object;
  avatar : any;
  image = MyApp.app_image;
  Myapp = MyApp;
  memberid : Number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http : Http, 
    public footerCtrl : FooterProvider, public ActionSheet : ActionSheetController, 
    public alertCtrl : AlertController, public Modal : ModalController, public storage : Storage) {
    this.footer = this.footerCtrl.footer;

    storage.get("user").then((row) => {
      this.memberid = row.memberid;

      if (row.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else
      {
        this.avatar = this.image + row.avatar;
      }
      

      this.allmessages().subscribe( res => {

        var messages = [];

        if(!res.length)
        {
          messages.push(res);

          this.messages = messages;
        }
        else
        {
          this.messages = res;
        }

        
      }, error => {
        console.log(error);
      });


    }); 

    
  }

  colorize(e){
    return "<b>"+e+"</b>";
  }

  allmessages()
  {
    var query = MyApp.app_api + "pastorMessage/-w memberid = "+ this.memberid;
    return this.http.get( query ).map(res => res.json() );

  }

  trash(id : Number){
    id = Number(id);

    this.alertCtrl.create({
      title: "Please confirm delete",
      subTitle: "Are you sure you want to delete this message?",
      buttons: [
        {
          text: 'Yes',
          role: 'yes',
          handler: () => {

            var trash = this.http.delete( MyApp.app_api + 'pastorMessage/'+ id).map( res => res.json() );
            trash.subscribe(res => {
              if(res.status == "success")
              {

                this.allmessages().subscribe( res => {
                  this.messages = res;
                });

                this.alertCtrl.create({
                  title: "Message deleted successfully",
                  subTitle: "Message Deleted successfully",
                  buttons: ['Ok']
                }).present();


              }
            });
          }
        },

        {
          text: "No",
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    }).present();
    
  }

  goback(){
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


  loadMessage(message){
    this.ActionSheet.create({
      title : "Message from " + message.yourname,
      buttons : [
        {
          text: 'Read',
          role: 'read',
          handler : () => {
            this.Modal.create(ReadmessagePage, {message}).present();
          }
        },

        {
          text: 'Delete',
          role: 'delete',
          handler : () => {
            this.trash(message.messageid);
          }
        },

        {
          text : 'Cancel',
          role: 'cancel',
          handler : () => {

          }
        }
      ]
    }).present();
  }

  ionViewDidLoad() {
  }

}
