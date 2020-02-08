import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController,
ModalController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { FooterProvider } from '../../providers/footer/footer';
import "rxjs/add/operator/map";
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { AttendanceinfoPage } from '../attendanceinfo/attendanceinfo';
import { AddattendancePage } from '../addattendance/addattendance';

@IonicPage()
@Component({
  selector: 'page-memberslist',
  templateUrl: 'memberslist.html',
})
export class MemberslistPage {

  footer : any;
  image = MyApp.app_image;
  members = [];
  program : any;
  avatar : string;
  defaultimage = "";
  info : any = {};
  churchid : any;
  defaultImage : any;
  userid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public footCtrl : FooterProvider, private storage : Storage,
  public http : Http, 
  public loader : LoadingController, 
  public alertCtrl : AlertController,
  public modalCtrl : ModalController) {
    this.footer = footCtrl.footer;
    this.program = navParams.get("program");
    this.defaultImage = MyApp.defaultImage;
    
    this.storage.get("user").then((row) => {
      this.defaultimage = 'assets/imgs/men3.jpg';
      if (row.avatar == "")
      {
        this.avatar = MyApp.defaultImage;
      }
      else{
        this.avatar = this.image + row.avatar;
      }

      this.userid = row.userid;
    });

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.attendanceInfo().subscribe( res => {

          var data = res.trim();
          data = JSON.parse(data);
          this.info = data;
        
        
      }, error => {
        this.alertCtrl.create({
          title: "Connection error",
          subTitle: "Failed to retrive attendance information. Check your connection..",
          buttons: ['Ok']
        }).present();
      });

      this.loadmembers();

    });

    

    // members.subscribe(res => {
      
    //   var obj:any = res.trim();
    //   obj = JSON.parse(obj);

    //   if (obj.length > 0)
    //   {
    //       var data = [];

    //       if ("status" in obj)
    //       {
    //         data.push(obj)
    //       }
    //       else{
    //         data = obj
    //       }

    //       this.members = data;
    //   }
      
    // });

  }

  reloadinfo()
  {
    this.attendanceInfo().subscribe( res => {

      var data = res.trim();
      data = JSON.parse(data);
      this.info = data;
    
    
    }, error => {
      this.alertCtrl.create({
        title: "Connection error",
        subTitle: "Failed to retrive attendance information. Check your connection..",
        buttons: ['Ok']
      }).present();
    }); 

  }

  attendanceInfo()
  {
    var program = this.program.program;
    var query = MyApp.sermon_api + "attendanceInfo/"+program+"/"+this.churchid;
    return this.http.get( query ).map(res => res.text());
  }

  allmembers()
  {
    var program = this.program.program;
    var query = MyApp.sermon_api + "attendanceList/"+program+"/"+this.churchid;
    return this.http.get( query ).map(res => res.text());
  }


  addinfo()
  {
      var program = this.program.program;
      this.navCtrl.push(AddattendancePage, {program});
  }

  loadmembers()
  {
    this.loader.create({
      content: "Building list",
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
      duration: 1000
    }).present();

    this.allmembers().subscribe(res => {  

      var obj:any = res.trim();
      obj = JSON.parse(obj);

        if (obj.length > 0)
        {
            var data = [];

            if ("status" in obj)
            {
              data.push(obj)
            }
            else{
              data = obj
            }

            this.members = data;
        }
        else
        {
          this.members = [];
        }
      
      
    });
  }

  viewinfo(info)
  {
    var program = this.program.program;
    this.modalCtrl.create(AttendanceinfoPage, {info, program}).present();
  }

  attendee(id){
    var program = this.program.program;
    var query = MyApp.sermon_api + "attendee/"+id+"/"+program+"/"+this.churchid;
    return this.http.get( query ).map(res => JSON.parse(res.text().trim()));
  }

  attend(member, program)
  {
    this.loader.create({
      content: member.fullname + " adding to " + program + " attendee ...",
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
      duration: 500
    }).present();

    var userid = this.userid;

    var query = MyApp.sermon_api + "attend/"+member.memberid+"/"+member.fullname+"/"+program+"/"+this.churchid+'/'+userid;
    var update = this.http.get( query ).map( res => JSON.parse(res.text().trim()));
    update.subscribe(res => {
      if(res.status == "good")
      {
        this.loadmembers();
        this.reloadinfo();
      }
    });
  }

  goback()
  {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
  }

}
