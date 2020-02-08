import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController
  , ActionSheetController, ModalController } from 'ionic-angular';
import { pastorModel } from '../../models/pastorsModel';
import { PastorsProvider } from '../../providers/pastors/pastors';
import { MyApp } from '../../app/app.component';
import { ShowsermonPage } from '../showsermon/showsermon';
import { SermonsProvider } from '../../providers/sermons/sermons';
import { Http } from '@angular/http';
import { DashboardPage } from '../dashboard/dashboard';
import { FooterProvider } from '../../providers/footer/footer';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


@IonicPage()
@Component({
  selector: 'page-pastor-sermons',
  templateUrl: 'pastor-sermons.html',
})
export class PastorSermonsPage {

  pastor : pastorModel[];
  pas : string;
  sermons : any;
  image = MyApp.app_image;
  sermon_user = [];
  app_url : any;
  data : any;
  id : Number;
  pastorName : string;
  $visible = false;
  footer : any;
  avatar : any;
  memberid : any;
  sermon_api : any;
  myapp : any;
  churchid : any;
  static editSermon : boolean = false;
  tabTitle = "New Sermon";
  myvideo:any = false;
  myphoto:any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public pastorP : PastorsProvider, public sermonPr : SermonsProvider, 
    public loader : LoadingController, public alertC : AlertController,
    public http : Http, public footerCtrl : FooterProvider,
    public ActionSheet : ActionSheetController,
    public ModelCtrl : ModalController,
    public storage : Storage,
    private camera : Camera, private transfer: FileTransfer ) {

    this.myapp = MyApp;
    this.app_url = MyApp
    this.sermon_api = MyApp.sermon_api;
    this.footer = this.footerCtrl.footer;
    
    this.pas = "all_sermons";
    this.pastor = null;
    this.data = new Function();
    this.data.button = "Add Sermon";

    this.avatar = MyApp.defaultImage;

    this.storage.get("user").then( (row) => {
      this.memberid = row.memberid;
      pastorP.loadMessages(row.memberid).subscribe(res => {

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

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;
    });


    
   
  }

  loadsermons(){

    this.data.button = "Add Sermon";
    this.data.sermonTopic = "";
    this.data.sermon = "";
    PastorSermonsPage.editSermon = false;
    this.tabTitle = "New Sermon";
    

    this.pastorP.loadMessages(this.memberid).subscribe(res => {

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
  }

  loading(msg = "", delay = 30000){
    this.loader.create({
      content: msg == "" ? 'Please wait..' : msg,
      duration: delay,
      dismissOnPageChange: true
    }).present();

  }

  showsermon(data: any){

    this.ActionSheet.create({
      title: data.sermonTopic,
      buttons: [
        {
          text: 'Read',
          role : 'read',
          handler : () => {
            this.loading();
            this.id = data.memberid;

           this.http.get( MyApp.app_api + 'members/-w memberid = '+ data.memberid).map(res => res.json())
           .subscribe( res => {
              this.navCtrl.push(ShowsermonPage, {data, res});
            });
          }
        },
        {
          text: "Edit Sermon",
          role: 'edit',
          handler: () => {
            this.pas = 'new_sermon';
            this.data.sermonTopic = data.sermonTopic;
            this.data.button = "Edit Sermon";
            this.data.sermon = data.sermon;
            this.data.id = data.sermonid;
            PastorSermonsPage.editSermon = true;
            this.tabTitle = "Edit Sermon";
          }
        },
        {
          text: "Delete",
          role: "delete",
          handler : () => {
            this.alertC.create({
              title: "Confirm delete action",
              subTitle: "Please confirm this delete operation. Are you sure ?",
              buttons: [
                {
                  text: 'Yes',
                  role: 'yes',
                  handler: () => {
                    this.loading("Please wait..", 2000);
                    this.deletesermon(data.sermonid).subscribe( res => {
                      if(res.status)
                      {
                        DashboardPage.liverefresh = true;
                        this.loadsermons();
                        
                        this.alertC.create({
                          title: 'Delete Successful',
                          buttons: ['Ok']
                        }).present();
                      }
                    });
                  }
                },

                {
                  text: "No",
                  role: 'no'
                }
              ]
            }).present();
          }
        },

        {
          text: "Cancel",
          role: "cancel",
          handler : () => {

          }
        }
      ]
    }).present();
  }

  deletesermon(id : any)
  {
    return this.http.delete( this.myapp.app_api + 'sermons/' + id ).map( res => res.json() );
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

  loadfirst(title, dur = 500)
  {
    this.loader.create({
      content: "Loading " + title + "...",
      duration: dur,
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    }).present();
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
      this.alertC.create({
        title: 'Failed!',
        subTitle: 'Please try again. App couldn\'t use your device camera.',
        buttons: ['Ok']
      }).present();
    });
  }

  takevideo()
  {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((videoData) => {
      this.myvideo = videoData;
     }, (err) => {
      // Handle error
       this.alertC.create({
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
      this.alertC.create({
        title: 'Failed!',
        subTitle: 'Please try again. App couldn\'t use your photo gallery.',
        buttons: ['Ok']
      }).present();
    });
  }

  createSermon(data)
  {
    const fileTransfer: FileTransferObject = this.transfer.create();

    var rand = Math.random() * 10000;

    var filename = 'img_article_'+rand+'_.jpg';

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: filename,
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: 'image/jpeg',
      headers: {}
    };
   
   if (this.myphoto !== false)
   {
        fileTransfer.upload(this.myphoto, MyApp.sermon_api + 'uploadImage', options)
        .then((data) => {
          // success
          this.uploadsermonnow(data, filename);
        }, (err) => {
          // error
          this.alertC.create({
            title: 'Failed to Upload Image',
            subTitle: 'Image selected could not be uploaded. Try another image',
            buttons: ['Ok']
          }).present();
        });
    }
    else
    {
        this.uploadsermonnow(data, 'default-sermon.jpg');
    }
  }

  uploadsermonnow(data, filename, video = false)
  {

    if(typeof data.sermonTopic != "undefined" && typeof data.sermon != "undefined" && data.sermonTopic.length > 2 && data.sermon.length > 2)
    {
      var formdata = new FormData();

      var sendform = true;
      var formimage = "";

      if(sendform == true)
      {
        var formFields = [];
        formFields['sermonTopic'] = data.sermonTopic;
        formFields['sermon'] = data.sermon;
        formFields['memberid'] = this.memberid;
        formFields['churchid'] = this.churchid;
        formFields['sermonImage'] = filename;
        formFields['sermonVideo'] = data.sermonVideo;
        

        for( var x in formFields)
        {
          formdata.append(x, formFields[x]);
        }

        if (PastorSermonsPage.editSermon == false)
        {

          this.loadfirst(", Creating Sermon", 3000);
          let send = this.sendPost(formdata);

          send.subscribe( res => {
            if(res.status == "success")
            {
                DashboardPage.liverefresh = true;

                this.alertC.create({
                  title: 'Sermon Added',
                  subTitle: "We have succesfully added your sermon. Would be seen by all members, admin, users generally.",
                  buttons: ['Ok']
                }).present(); 

                data.sermonTopic = "";
                data.sermon = "";
                data.sermonImage = "";
              
            }
            else
            {
              this.alertC.create({
                title: 'Failed to add Sermon',
                subTitle: "Please try again later. server busy..",
                buttons: ['Ok']
              }).present(); 
            } 
          });

        }
        else
        {
          formdata.append("id", data.id);
          this.loadfirst(", Updating Sermon", 3000);
          let update = this.updatePost(formdata);

          update.subscribe( res => {
            if(res.status == "success")
            {
              DashboardPage.liverefresh = true;

                this.alertC.create({
                  title: 'Sermon Updated',
                  subTitle: "We have succesfully updated your sermon.",
                  buttons: ['Ok']
                }).present(); 

                data.sermonTopic = "";
                data.sermon = "";
                data.sermonImage = "";

                this.pas = "all_sermons";
                this.loadsermons();
              
            }
            else
            {
              this.alertC.create({
                title: 'Failed to update Sermon',
                subTitle: "Please try again later. server busy..",
                buttons: ['Ok']
              }).present(); 
            } 
          });

        }
      } 
    }
    else
    {
      this.alertC.create({
        title: "Input Error",
        subTitle: "Sermon Topic or Sermon was not provided. Both fields are required.",
        buttons: ['OK']
      }).present();
    } 
  }

  sendPost(data){
    return this.http.post( this.myapp.sermon_api + 'addSermon', data ).map( 
      res => res.json() );
  }

  updatePost(data)
  {
    return this.http.post(this.myapp.sermon_api + 'updatesermon', data).map(res => res.json() );
  }

}
