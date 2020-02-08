import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { BudgetsPage } from '../budgets/budgets';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-expenditure',
  templateUrl: 'expenditure.html',
})
export class ExpenditurePage {

  budget : any;
  footer : any;
  departments : any = {};
  avatar : any;
  balances : any = {};
  churchid : any;
  department : boolean = false;
  myphoto:any = false;
  memberid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, public alertCtrl : AlertController, 
  public loader : LoadingController, public http : Http,
  public storage : Storage,
  private camera : Camera, private transfer: FileTransfer) {
    this.budget = new Function();
    this.footer = this.footerCtrl.footer;
    

    this.storage.get("user").then( (res) => {
      if (res !== null)
      {
        if (res.avatar != "hello.png")
        {
          this.avatar = res.avatar;
        }
        else
        {
          this.avatar = MyApp.defaultImage;
        }
        
        this.memberid = res.memberid;

        var role:any = "";

        if ('role' in res)
        {
          role = res.role.toLowerCase();
        }
        else
        {
          role = "admin";
        }

        if (role == "hod")
        {
          if (res.department != "")
          {
            this.department = res.department;
          }
          else
          {
            this.department = false;
          }
        }
      }
    }); 

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.loaddepartments().subscribe(res => {
        var data = [];
  
        if (res.status == "success")
        {
          data.push(res);
        }
        else{
          if (res.length > 0)
          {
            data = res;
          }
          
        }
  
        this.departments = data;
  
        for (var x in data)
        {
          this.balances[data[x].department] = data[x].allocated - data[x].withdrawned;
        }
  
      });
      
    });

   
  }

  ionViewDidLoad() {

  }

  loaddepartments()
  {
    return this.http.get( MyApp.app_api + 'departmenthead/-w allocated > withdrawned and churchid ='+this.churchid).map(res => res.json());
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

  takephoto()
  {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      targetHeight: 300,
      targetWidth:300
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.myphoto = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
     // Handle error
      this.alertCtrl.create({
        title: 'Failed!',
        subTitle: 'Please try again. App couldn\'t use your device camera.',
        buttons: ['Ok']
      }).present();
    });
  }

  selectphoto()
  {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetHeight: 300,
      targetWidth:300
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.myphoto = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
     // Handle error
      this.alertCtrl.create({
        title: 'Failed!',
        subTitle: 'Please try again. App couldn\'t use your photo gallery.',
        buttons: ['Ok']
      }).present();
    });
  }

  expense()
  {
    if ("department" in this.budget && "amount" in this.budget && "spent" in this.budget)
    {
      const fileTransfer: FileTransferObject = this.transfer.create();

      var rand = Math.random() * 10000;

      var filename = 'img_expenses_'+rand+'_.jpg';

      var loading = this.loader.create({
        content: "Please wait...",
        duration: 40000,
        enableBackdropDismiss: true
      });

      let options: FileUploadOptions = {
        fileKey: 'photo',
        fileName: filename,
        chunkedMode: false,
        httpMethod: 'post',
        mimeType: 'image/jpeg',
        headers: {}
      };

      var waitforupload = false;
   
      if (this.myphoto !== false)
      {
          waitforupload = true;

          loading.present();

          fileTransfer.upload(this.myphoto, MyApp.sermon_api + 'uploadImage', options)
          .then((data) => {

            loading.dismiss();
            // success
            this.uploadbudgetnow(filename);

          }, (err) => {
            // error
            this.alertCtrl.create({
              title: 'Failed to Upload Image',
              subTitle: 'Image selected could not be uploaded. Try another image',
              buttons: ['Ok']
            }).present();
          });
      }
      else
      {
        this.uploadbudgetnow(filename);
      }

      
    }
  }

  uploadbudgetnow(filename)
  {
      var budget : any = this.balances[this.budget.department];
      var balance : any = this.budget.amount - this.budget.spent;
      var bal : any = budget - this.budget.spent;
      var formdata = new FormData();

      if (this.budget.purpose == "") { this.budget.purpose = " ";}

      formdata.append("budget[departmenthead]", this.budget.department);
      formdata.append("budget[amount]", this.budget.amount);
      formdata.append("budget[purpose]", this.budget.purpose);
      formdata.append("budget[amountspent]", this.budget.spent);
      formdata.append("budget[balance]", balance);
      formdata.append("budget[budgetbalance]", bal);
      formdata.append("budget[allocated]", budget);
      formdata.append("budget[churchid]", this.churchid);
      formdata.append("budget[receipt]", filename);
      formdata.append("budget[memberid]", this.memberid);

      var loading = this.loader.create({
        content: "Submitting expense.",
        duration: 40000,
        enableBackdropDismiss: true
      });

      loading.present();

      this.http.post( MyApp.sermon_api + 'expenses/'+this.churchid, formdata).map(res => res.json())
      .subscribe( res => {

        loading.dismiss();
        if (res.status == "success")
        {
          this.alertCtrl.create({
            title: "Expenses Added",
            subTitle: this.budget.department + " expense added successfully.",
            buttons: ['Ok']
          }).present();

          this.navCtrl.setRoot(this.navCtrl.getActive().component);

        }
        else
        {
          this.alertCtrl.create({
            title: "Failed!",
            subTitle: this.budget.department + " could not be added, try again later..",
            buttons: ['Ok']
          }).present();
        }
      });
  }

  minus(num1, num2)
  {
    num1 = Number(num1);
    num2 = Number(num2);

    return num1 - num2;
  }

}
