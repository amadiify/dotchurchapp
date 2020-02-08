import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';
import { LibraryPage } from '../library/library';


@IonicPage()
@Component({
  selector: 'page-pendingarticles',
  templateUrl: 'pendingarticles.html',
})
export class PendingarticlesPage {

  empty : any;
  footer : any;
  image = MyApp.app_image;
  avatar : any;
  articles : any;
  churchid : any;
  contents : any = null;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage : Storage,
    public http : Http,
    public alertCtrl : AlertController,
    public footerCtrl : FooterProvider) {

    storage.get("user").then((res) => {

      if (res.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else
      {
        this.avatar = this.image + res.avatar;
      }
      
    });

    this.footer = footerCtrl.footer;

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;
      this.reload();
    });
  }

  reload()
  {
    this.loadAll().subscribe(res => {
      if(typeof res == "object" && res.status == "empty")
      {
        this.empty = true;
      }
      else
      {
        this.empty = false;

        var data = [];

        for(var x in res)
        {
          if(typeof res[x] == "object")
          {
            data.push(res[x]);
          }
        }

        this.articles = data;
      }
    }, error => {
      this.empty = true;
    });
  }

  loadAll()
  {
    return this.http.get(MyApp.sermon_api + 'articles/0/'+this.churchid).map(res => res.json());
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

  approve(id)
  {
    this.http.get(MyApp.sermon_api + "approveA/"+id).map(res => res.json()).subscribe( res => {
      if(res.status == "success")
      {
        this.alertCtrl.create({
          title: "Success",
          subTitle: "Article approved successfully",
          buttons:['Ok']
        }).present();

        this.reload();
      }
    }, error => {
      this.alertCtrl.create({
        title: "Failed",
        subTitle: "Please try again later.",
        buttons:['Ok']
      }).present();
    });
  }

  library(type:any)
  {
      let content = this.fetchLibrary(type);

      /*
      if (this.contents != null)
      {
         content = this.contents;

         this.navCtrl.push(LibraryPage, {content, type});

         this.http.get(MyApp.sermon_api + 'library/' + type+'/'+this.churchid).map(res => res.json()).subscribe(res => {
            this.storage.set(type, res);
            this.contents = res;
          });
      }
      else
      {
         
      }
      */

      content.subscribe(res => {
              var content = res;
              this.contents = content;

              this.navCtrl.push(LibraryPage, {content, type});
      });
      
  }

  fetchLibrary(type:string)
  {
      // get previous. then fetch new ones 
      if (type in this.storage.keys())
      {
          this.storage.get(type).then(res => {
              this.contents = res;
          });
      }
      else
      {
          // now fetch
          
      }

      return this.http.get(MyApp.sermon_api + 'library/' + type +'/'+this.churchid).map(res => res.json());
  }

  ionViewDidLoad() {
  }

}
