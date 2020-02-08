import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController, ActionSheetController } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  footer : any;
  user : any;
  data : any;
  $visible : boolean;
  memberid : any;
  userid : number;
  Myapp : any;
  account : any;
  login : any;
  avatar : any;
  image = MyApp.app_image;
  defaultimage = "";
  footerCtrl : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http : Http, public AlertCtrl : AlertController, 
  public Loader : LoadingController, private storage : Storage, public Modal : ModalController, public ActionSheet : ActionSheetController) {
   // this.footer = footerCtrl.footer;
   this.user = 'info';
   this.data = new Function();
   this.$visible = false;
   this.Myapp = MyApp;

   this.footerCtrl = new FooterProvider(Modal, ActionSheet);
   this.footer = this.footerCtrl.footer;

   this.storage.get("user").then((row) => {
    
    this.defaultimage = '../assets/imgs/men3.jpg';
    if (row.avatar == "hello.png")
    {
      this.avatar = MyApp.defaultImage;
    }
    else{
      this.avatar = this.image + row.avatar;
    }

    this.memberid = row.memberid;
    this.userid = row.userid;

    this.loadmember().subscribe(res => {
    
      this.data.fullname = res.fullname;
      this.data.dob = res.dob;
      this.data.email = res.email;
      this.data.address = res.address;
      this.data.telephone = res.telephone;
      this.data.occupation = res.occupation;

     });

     this.loaduser();

  });
  
  }

  ionViewDidLoad() {
  }

  loadmember()
  {
    return this.http.get( this.Myapp.app_api + 'members/'+this.memberid ).map( res => res.json() );
  }

  loaduser()
  {
    this.http.get( this.Myapp.app_api + 'users/'+this.userid ).map( res1 => JSON.parse(res1.text().trim()) ).subscribe(res2 => {
      this.login = res2;
      this.data.username = res2.username;
      this.data.password = res2.password;
     });
  }


  loading(message, duration = 1000)
  {
    this.Loader.create({
      content: message,
      duration: duration,
      dismissOnPageChange: true,
      enableBackdropDismiss:true
    }).present();
  }

  alertmessage(title, message){
    this.AlertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["Ok"]
    }).present();
  }

  updateSettings(data):any{
    if(data.username != "" && data.password != '')
    {
      this.loading("Updating",2000);
      var formdata = {};
      formdata['username'] = data.username;
      formdata['password'] = data.password;

      this.http.post( this.Myapp.app_api + 'users/' + this.userid, JSON.stringify(formdata)).map(res => res.json() )
      .subscribe(res => {
        if (res.status == "success")
        {
          this.alertmessage("Update Successful", "Your Account Settings has been updated successfully");
          this.loaduser();
        }
        else
        {
          this.alertmessage("Update failed", "Failed to update account. Please try again..");
        }

      });

    }
  }

  updateProfile(data):any{
    var form = document.forms['profile'];

    var formdata = new FormData();
    var process = true;
    
    if(typeof form.avatar != "undefined")
    {
      var avatar = form.avatar.files;

      if(avatar.length > 0)
      {
        var types = ['png', 'jpg', 'gif', 'jpeg'];
        var type = avatar[0].type.split("/").pop();

        if(types.indexOf(type) >= 0)
        {
            avatar = avatar[0];
            formdata.append("avatar", avatar);
        }
        else
        {
          process = false;
          this.alertmessage("Unsupported Image", "Cannot Upload such file as a profile picture. Must be " + types.toLocaleString());
        }
      }
    }
    

    for(var x in data)
    {
      if (data[x] != "")
      {
        formdata.append(x, data[x]);
      }
    }

    if (process == true)
    {
      this.loading("Updating Profile", 2000);

      this.http.post( this.Myapp.sermon_api + 'profile/' + this.memberid, formdata).map( res => res.json() )
      .subscribe(res => {
        if(res.status)
        {
          this.alertmessage("Profile Updated", "Your profile has been updated successfully.");
          this.loadmember();
          this.userinfo(this.userid).subscribe(info => {
              this.avatar = this.image + info.avatar;
              this.storage.set('user', info);
          });
        }
      });
    }
  }

  goback(){
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

  userinfo(id:Number)
  {
    return this.http.get(MyApp.app_api + 'members/-w userid =' + id).map(res => res.json());
  }


}
