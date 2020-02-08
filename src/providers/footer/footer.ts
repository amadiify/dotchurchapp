import { Component } from '@angular/core';
import { IonicPage, ModalController, ActionSheetController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { ProfilePage } from '../../pages/profile/profile';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { EnvelopePage } from '../../pages/envelope/envelope';
import { NewarticlePage } from '../../pages/newarticle/newarticle';

@IonicPage()
@Component({
  selector: 'footer-provider',
  template: '',
})
class FooterProvider {
  myapp = MyApp;
  Myapp : any;
  footer = [];
  dashp = DashboardPage;
  dashOb : any;
  modal : any;
  actionSheet : any;

  constructor(public Modal : ModalController, 
    public ActionSheet : ActionSheetController) {

    this.Myapp = MyApp;
    this.dashOb = DashboardPage;
    this.Modal = arguments[0];
    this.actionSheet = arguments[1];
    var iconName = "", action;
    

    if (this.myapp.userRole == "admin")
    {
      iconName = "person";
      action = "people";
    }
    else
    {
      iconName = "person";
      action = "profile";
    }

    this.footer = [
      {col:35, clickA: 'envelope', iconName:'mail', cstyle:'left', cclass:''},
      {col:30, clickA: 'camera', iconName:'camera', cstyle: 'center', cclass:'button-round'},
      {col:35, clickA: action, iconName: iconName, cstyle:'right', cclass:''}
    ];
  }

  navigate(action: string)
  {
    if(action == "profile")
    {
      this.Modal.create(ProfilePage).present();
    }
    else if(action == "envelope")
    {
      this.Modal.create(EnvelopePage).present();
    }
    else if(action == "people")
    {
      this.Modal.create(ProfilePage).present();
    }
    else if(action == "camera")
    {
      this.ActionSheet.create({
        title: "Camera",
        buttons: [
          // {
          //   text: "Take a picture & share",
          //   role:'snap',
          //   handler : () => {

          //   }
          // },

          {
            text: "Create a public article",
            role: 'snap',
            handler: () => {
              this.Modal.create(NewarticlePage).present();
            }
          },

          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).present();
    }
  }

}

export {FooterProvider}