import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { FooterProvider } from '../../providers/footer/footer';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { MyarticlesPage } from '../myarticles/myarticles';
import { DashboardPage } from '../dashboard/dashboard';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


@IonicPage()
@Component({
  selector: 'page-newarticle',
  templateUrl: 'newarticle.html',
})
export class NewarticlePage {

  footer: any;
  avatar : any;
  image = MyApp.app_image;
  article : any;
  footerCtrl : any;
  memberid : any;
  role : any;
  churchid : any;
  clicked : boolean = false;
  articleData : any = false;
  pageTitle : string = "New Article";
  myphoto:any = false;
  myvideo:any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public Modal : ModalController, public ActionSheet : ActionSheetController,
  public alertCtrl : AlertController, public http : Http, 
  public loader : LoadingController, public storage : Storage,
  private camera : Camera, private transfer: FileTransfer) {

  

    this.footerCtrl = new FooterProvider(Modal, ActionSheet);
    this.footer = this.footerCtrl.footer;
    this.article = new Function();
    this.clicked = this.navParams.get("clicked") || false;

    

    this.avatar = MyApp.defaultImage;
    
    storage.get("user").then((res) => {
      this.memberid = res.memberid;
      this.role = res.role;

      this.storage.get("churchid").then((id)=>{
        this.churchid = id;
      });

    });


    if (typeof this.navParams.get("article") != "undefined")
    {
      this.articleData = this.navParams.get("article");
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

  loading(content)
  {
    return this.loader.create({
      content: content,
      duration: 50000,
      enableBackdropDismiss: false,
      dismissOnPageChange: true
    });
  }

  ionViewDidLoad() {
    if (this.articleData)
    {
      this.pageTitle = "Edit Article";

      this.article.title = this.articleData.articletopic;
      this.article.text = this.articleData.article;
    }
  }

  processImage()
  {
    
  }

  showbutton()
  {

    if (this.articleData === false)
    {
        if (this.clicked === false)
        {
          return true;
        }
        else
        {
          return false;
        }
        
    }
    else
    {
      return false;
    }
     
  }

  publish(article)
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

    var waitforupload = false;
   
   if (this.myphoto !== false || this.myvideo !== false)
   {
      
      if (this.myvideo !== false)
      {
          filename = 'video_article_'+rand+'_.mp4';

          let options: FileUploadOptions = {
            fileKey: 'video',
            fileName: filename,
            chunkedMode: false,
            httpMethod: 'post',
            mimeType: 'video/mp4',
            headers: {}
          };

          fileTransfer.upload(this.myvideo, MyApp.sermon_api + 'uploadVideo', options)
          .then((data) => {

            // success
            this.uploadarticlenow(article, filename);

          }, (err) => {
            // error
            this.alertCtrl.create({
              title: 'Failed to Upload Video',
              subTitle: 'Video selected could not be uploaded. Try another Video',
              buttons: ['Ok']
            }).present();
          });
      }
      

      if (this.myphoto !== false)
      {
        fileTransfer.upload(this.myphoto, MyApp.sermon_api + 'uploadImage', options)
        .then((data) => {

          // success
          this.uploadarticlenow(article, filename);

        }, (err) => {
          // error
          this.alertCtrl.create({
            title: 'Failed to Upload Image',
            subTitle: 'Image selected could not be uploaded. Try another image',
            buttons: ['Ok']
          }).present();
        });
      }
    }
    else
    {
      this.uploadarticlenow(article, filename);
    }

  }

  uploadarticlenow(article, filename)
  { 
    var formdata = new FormData();
    
    if(filename.substring(-3) == 'mp4')
    {
      formdata.append("articleData[video]", filename);
    }
    else
    {
      formdata.append("articleData[image]", filename);
    }
    

    formdata.append("articleData[memberid]", this.memberid);
    formdata.append("articleData[role]", this.role);

    for (var x in article)
    {
      formdata.append("articleData["+x+"]", article[x]);
    }

    if("title" in article && "text" in article)
    {
      formdata.append('articleData[churchid]', this.churchid);

      DashboardPage.liverefresh = true;

      if (this.articleData === false)
      {
        var load = this.loading("Submitting");
        load.present();

        this.http.post( MyApp.sermon_api + 'newarticle', formdata).map( res => res.json()).subscribe( res => {
          if(res.status == "published")
          {

            this.storage.get("user").then( res => {
              if (res.role == "admin")
              {
                MyApp.newArticle = true;
              }
            });

            load.dismiss();

            this.alertCtrl.create({
              title: "Published Successfully",
              subTitle: "Would you like to continue ?",
              buttons: [
                {
                  text: 'Yes',
                  role: 'preview',
                  handler: () => {

                    var inputs = document.querySelectorAll('[type="text"]');
                    var textarea = document.querySelectorAll('textarea');

                    [].forEach.call(inputs, (e) => {
                      e.value = "";
                    });

                    if (textarea.length > 0)
                    {
                      [].forEach.call(textarea, (e)=>{
                        e.value = "";
                      });
                    }

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
                },

                {
                  text: "No thanks",
                  role: 'cancel'
                }
              ]
            }).present();
          }
        }, error => {
          this.alertCtrl.create({
            title: "Publish Error",
            subTitle: "Please try again later..",
            buttons: ['Ok']
          }).present();
        });
      }
      else
      {
        var loader = this.loading("Updating");
        loader.present();

        var articledata = this.articleData;
        formdata.append('articleData[aid]', articledata.articleid);

        this.http.post( MyApp.sermon_api + 'updatearticle', formdata).map( res => res.json()).subscribe( res => {
          if(res.status == "published")
          {
            this.storage.get("user").then( res => {
              if (res.role == "admin")
              {
                MyApp.newArticle = true;
              }
            });

            loader.dismiss();

            this.alertCtrl.create({
              title: "Updated Successfully",
              subTitle: "Would you like to continue ?",
              buttons: [
                {
                  text: 'Yes',
                  role: 'preview',
                  handler: () => {

                    this.navCtrl.setRoot(MyarticlesPage);
                  }
                },

                {
                  text: "No thanks",
                  role: 'cancel'
                }
              ]
            }).present();
          } 
        }, error => {

        });
      }
    }
    else
    {
      this.alertCtrl.create({
        title: "Publish Error",
        subTitle: "All entries are required! ",
        buttons: ['Ok']
      }).present();
    }
  }

  goback()
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
