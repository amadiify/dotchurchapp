import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { SermonsProvider } from '../../providers/sermons/sermons';
import { Sermons } from '../../models/_sermons';
import { MyApp } from '../../app/app.component';
import { ShowsermonPage } from '../showsermon/showsermon';
import { LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { FooterProvider } from '../../providers/footer/footer';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  
  user:object;
  sermons : Sermons[];
  sermon_user = [];
  image = MyApp.app_image;
  _sermons = [];
  Myapp = MyApp
  avatar : string;
  footer : object;
  sermonUsers : any;
  logged : any;
  doneLoading = false;
  defaultimage = "";
  sermonusers = "";
  programs : any;
  churchid : any;
  churchdata : any;
  noprogram : boolean = true;
  static loaded : boolean = false;
  static loadedData : any = "";
  static loadedProgram : any = "";
  static loadedChurchData : any = "";
  static liverefresh :boolean = false;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCntr: ViewController, public sermonPr : SermonsProvider, public loadingCtr: LoadingController, 
    public footerCtrl : FooterProvider, private storage : Storage,
    public http : Http) {
    this.user = navParams.get("user"); 

    this.defaultimage = 'assets/imgs/men3.jpg';

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      if (DashboardPage.loaded !== true)
      {
        this.churchinfo().subscribe(res => {
          if (res.status == "success")
          {
            this.churchdata = res;
            DashboardPage.loadedChurchData = res;
          }
        });
      }
      else
      {
        if (DashboardPage.liverefresh == true)
        {
          this.churchinfo().subscribe(res => {
            if (res.status == "success")
            {
              this.churchdata = res;
              DashboardPage.loadedChurchData = res;
            }
          });
        }
        else
        {
          this.churchdata = DashboardPage.loadedChurchData;
        }
        
      }
      
      
      if (DashboardPage.loaded == false)
      {
        this.loadprograms().subscribe(res => {
          this.programs = res;
          DashboardPage.loadedProgram = res;
        }, error => {
    
        });
      }
      else
      {
        if (DashboardPage.liverefresh == true)
        {
          this.loadprograms().subscribe(res => {
            this.programs = res;
            DashboardPage.loadedProgram = res;
          }, error => {
      
          });
        }
        else
        {
          var res = DashboardPage.loadedProgram;
          this.programs = res;
        }
       
      }
      

      try
      {
        this.loadsermons(id);
      }
      catch(e)
      {
        console.log(e);
      }    
      
    });

    this.loadingDashboard().present();

    this.storage.get("user").then((row) => {

      if(typeof row == "object")
      {
        if ( row.avatar == "hello.png" )
        {
          this.avatar = this.Myapp.defaultImage;
        }
        else{
          this.avatar = this.image + row.avatar;
        }
      }
    });

    
    
    this.footer = this.footerCtrl.footer;
           
     
  }

  slideChanged()
  {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 10)
    {
      this.slides.stopAutoplay();
    }
  }

  loadprograms()
  {
    return this.http.get(this.Myapp.sermon_api + 'programs/'+this.churchid).map(res => res.json());
  }

  subsr(text)
  {
    return text.substring(0,15);
  }

  loadsermons(id)
  {

    if (DashboardPage.loaded !== true && DashboardPage.loadedData == "" && MyApp.newArticle == false)
    {
      this.sermonPr.loadAll(id).subscribe(res => {

        DashboardPage.loadedData = res;
        MyApp.newArticle = false;

        var _res = [];
  
        for (var r in res )
        {
          if (typeof res[r] == "object")
          {
            _res.push(res[r]);
          }
        }
  
        this.sermons = _res;
        
        this._sermons.push(_res[0]);
  
        if (this.sermon_user.length > 0)
        {
          this.doneLoading = true;
        }
  
        this.noprogram = false; 
        DashboardPage.loaded = true;
        
      }, error => {
        this.noprogram = true;
        this.loadingDashboard().dismiss();
      }); 
    }
    else
    {

      if (DashboardPage.liverefresh == true)
      {
        this.sermonPr.loadAll(id).subscribe(res => {

          DashboardPage.loadedData = res;
          MyApp.newArticle = false;
  
          var _res = [];
    
          for (var r in res )
          {
            if (typeof res[r] == "object")
            {
              _res.push(res[r]);
            }
          }
    
          this.sermons = _res;
          
          this._sermons.push(_res[0]);
    
          if (this.sermon_user.length > 0)
          {
            this.doneLoading = true;
          }
    
          this.noprogram = false; 
          DashboardPage.loaded = true;
          
        }, error => {
          this.noprogram = true;
          this.loadingDashboard().dismiss();
        }); 

        DashboardPage.liverefresh = false;
      }
      else
      {
        var res = DashboardPage.loadedData;

        var _res = [];
  
        for (var r in res )
        {
          if (typeof res[r] == "object")
          {
            _res.push(res[r]);
          }
        }
  
        this.sermons = _res;
        
        this._sermons.push(_res[0]);

        this.loadingDashboard().dismiss();
      }
    }
    
  }

  sayhelo()
  {
    console.log("helo");
  }

  profile(data : any)
  {
    console.log(data.push);
  }

  getProfile()
  {
    this.navCtrl.push(ProfilePage, this.Myapp.session_id);
  }

  loadingDashboard()
  {
    return this.loadingCtr.create({
      content: '',
      duration: 3000,
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    });
  }
  
  onLoading(){
      this.loadingCtr.create({
        content: '',
        duration: 30000,
        dismissOnPageChange: true
      }).present();
  }

  getSermon(data: any)
  {
    return {avatar:'', fullname:''};
  }


  showSermon(data){
    this.onLoading();
    var res = data.member;
    this.navCtrl.push(ShowsermonPage, {data, res});
  }


  churchinfo()
  {
    let info = this.http.get(this.Myapp.app_api + 'churches/-w churchid = ' + this.churchid).map(res => res.json());
    return info;
  }

  

  ionViewWillEnter(){
    
    this.viewCntr.showBackButton(false);
  }

  ionViewDidLoad() {
    this.viewCntr.showBackButton(false);
    
    this.storage.get("user").then((row) => {

      if(typeof row == "object")
      {
        if ( row.avatar == "hello.png" )
        {
          this.avatar = this.Myapp.defaultImage;
        }
        else{
          this.avatar = this.image + row.avatar;
        }
      }
    });
  }

}


