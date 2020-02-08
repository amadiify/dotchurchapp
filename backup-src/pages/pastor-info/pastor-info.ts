import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { pastorModel } from '../../models/pastorsModel';
import { PastorsProvider } from '../../providers/pastors/pastors';
import { MyApp } from '../../app/app.component';
import { ShowsermonPage } from '../showsermon/showsermon';
import { SermonsProvider } from '../../providers/sermons/sermons';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { FooterProvider } from '../../providers/footer/footer';

interface Response{

}

@IonicPage()
@Component({
  selector: 'page-pastor-info',
  templateUrl: 'pastor-info.html',
})
export class PastorInfoPage {

  pastor : pastorModel[];
  pas : string;
  sermons : any;
  image = MyApp.app_image;
  sermon_user = [];
  Myapp : any;
  message : any;
  id : Number;
  pastorName : string;
  avatar : any;
  footer : any;
  churchid : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public pastorP : PastorsProvider, public sermonPr : SermonsProvider, 
    public loader : LoadingController, public alertC : AlertController,
    public http : Http, private storage : Storage,
    public footerCtrl : FooterProvider ) {
    var person = navParams.get("person");
    this.pas = "sermons";
    this.pastor = person;
    this.message = new Function();
    this.pastorName = person.fullname;

    this.footer = footerCtrl.footer;

    this.storage.get("user").then((row) => {
      this.avatar = this.image + row.avatar;
    });

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.pastorP.loadMessages(person.memberid).subscribe(res => {

        if (res.length >= 1)
        {
          this.sermons = res;
        }
        else
        {
          this.sermons = [];
          this.sermons.push(res);
        }
      });
    });

   
  }

  loading(msg = "", delay = 30000){
    this.loader.create({
      content: msg == "" ? 'Please wait..' : msg,
      duration: delay,
      dismissOnPageChange: true
    }).present();
  }

  showsermon(data: any){

    this.loading();
    this.id = data.memberid;

    this.http.get(MyApp.app_api + 'members/-w memberid = '+ data.memberid).map(res => res.json())
    .subscribe(res => {
      this.navCtrl.push(ShowsermonPage, {data, res});
    });
  }

  sendMessage(data)
  {
   this.loading("Sending Message.. ", 3000);
    var form = new FormData();
    data.memberid = this.id;

    var formdata = {};
    for(var ele in this.message)
    {
      formdata[ele] = data[ele];
      this.message[ele] = "";
      form.append("sendMessage[]", data[ele]);
    }

    var post = this.sendPost(formdata);

    post.subscribe(res => {

      if (typeof res == "object" && res['status'] == "success")
      {
        this.alertC.create({
          title: "Message Delivered",
          subTitle: "Your message has been submitted to "+ this.pastorName +" desk. Thank you for using this service. ",
          buttons: ['Ok']
        }).present();
      }
      else
      {
        this.alertC.create({
          title: "Message not sent!",
          subTitle: "Your message could not be processed at this time, please try again later. Thanks",
          buttons: ['Ok']
        }).present();
      }
    })


  }

  sendPost(data): Observable<Response>{
    return this.http.put( this.Myapp.app_api + 'pastorMessage/-w churchid = '+this.churchid, JSON.stringify(data) ).map( 
      res => <Response>res.json() );
  }
  ionViewDidLoad() {
    this.Myapp = MyApp;
  }

}
