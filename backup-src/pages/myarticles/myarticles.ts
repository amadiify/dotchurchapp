import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { FooterProvider } from '../../providers/footer/footer';
import { MyApp } from '../../app/app.component';
import { NewarticlePage } from '../newarticle/newarticle';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-myarticles',
  templateUrl: 'myarticles.html',
})
export class MyarticlesPage {

  memberid : any = null;
  articles : any;
  footer : any;
  empty = true;
  avatar : any;
  image = MyApp.app_image;
  member : any = 0;
  footerCtrl : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public http : Http, public storage : Storage, public Modal : ModalController,
    public ActionSheet : ActionSheetController, 
   public loader : LoadingController,
  public alertCtrl : AlertController) {

      this.footerCtrl = new FooterProvider(Modal, ActionSheet);
      this.footer = this.footerCtrl.footer;

      storage.get("user").then((res) => {
        this.memberid = res.memberid; 

        if (res.avatar == "hello.png")
        {
          this.avatar = MyApp.defaultImage;
        }
        else
        {
          this.avatar = this.image + res.avatar;
        }
       
        this.member = res;
        
        this.reload();
      });

      if (this.memberid != 0)
      {
        this.reload();
      }


      
  }

  editarticle(article)
  {
    this.navCtrl.push(NewarticlePage, {article});
  }

  reload()
  {
    var loader = this.loading("Loading Articles");

    try
    {
      loader.present();

      this.loadAll().subscribe(res => {

        loader.dismiss();

        if(typeof res == "object" && res.status == "empty")
        {
          this.empty = true;
        }
        else
        {
          var data = [];
  
          for(var x in res)
          {
            if(typeof res[x] == "object")
            {
              data.push(res[x]);
            }
          }
  
          if (data.length > 0)
          {
            this.empty = false;
          }
  
          this.articles = data;
        }
      }, error => {
        loader.dismiss();
        this.alertCtrl.create({
          title: "No article",
          subTitle: "Could not find an article to load. Try creating one",
          buttons: ['Ok']
        }).present();
  
        this.empty = true;
      });
    }
    catch(e)
    {
      loader.dismiss();
    }
  }

  deletearticle(id)
  {
    DashboardPage.loaded = false;

    this.alertCtrl.create({
      title: "Confirm delete",
      buttons : [
        {
          text: "Yes",
          role: 'delete',
          handler : () => {
            this.loader.create({
              content: "Deleting Article...",
              dismissOnPageChange: true,
              enableBackdropDismiss: true,
              duration: 3000
            }).present();

            this.http.get( MyApp.sermon_api + 'deleteA/' + id ).map( res => res.json())
            .subscribe(res => {
              
              DashboardPage.liverefresh = true;
              this.alertCtrl.create({
                title: "Article deleted successfully",
                buttons: ['Ok']
              }).present();

              this.reload();

            }, error => {
              this.alertCtrl.create({
                title: "Error deleting",
                subTitle: "Please try again later",
                buttons: ['Ok']
              }).present();
            })
          }
        },

        {
          text : 'No',
          role : 'cancel'
        }
      ]
    }).present();
    
  }

  loading(content)
  {
    return this.loader.create({
      content: content,
      duration: 40000,
      enableBackdropDismiss:false,
      dismissOnPageChange:false
    });
  }

  loadAll()
  {
    if (this.memberid !== null)
    {
    return this.http.get( MyApp.sermon_api + "articles/"+ this.memberid).map(res => res.json());      
    }
  }

  createArticle()
  {
    var clicked = true;
    DashboardPage.loaded = false;
    this.navCtrl.push(NewarticlePage, {clicked});
  }

  goback()
  {
    if(this.navCtrl.canGoBack() == true)
    {
      this.navCtrl.setRoot(DashboardPage);
    }
    else
    {
      this.navCtrl.insert(0, DashboardPage);
      this.navCtrl.pop();
    }
  }

  ionViewDidLoad() {
  }

}
