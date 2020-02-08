import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';
import { DocumentViewer } from '@ionic-native/document-viewer';


@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {

  page : any = "";
  content : any = {};
  footer : any;
  empty : boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, private document: DocumentViewer) {

  	let content = this.navParams.get('content');
  	let type = this.navParams.get('type');
  	this.content = content;
  	this.page = type; 
  	this.footer = footerCtrl.footer;

    for (var x in content)
    {
       this.empty = false;
    }
  }

  ucfirst(str)
  {
     let strr = str.substr(0,1);
     strr = strr.toUpperCase();

     return strr + str.substring(1);
  }

  ionViewDidLoad() {
  }

  view(doc)
  {
	const options: DocumentViewerOptions = {
	  title: doc.localtitle
	};

	this.document.viewDocument(doc.localpath, 'application/pdf', options);
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
}
