import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { MyApp } from '../../app/app.component';


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
  public footerCtrl : FooterProvider, private document: DocumentViewer,
  private file : File, private transfer : FileTransfer,
  private platform : Platform) {

  	let content = this.navParams.get('content');
  	let type = this.navParams.get('type');
  	this.content = content;
  	this.page = type; 
  	this.footer = footerCtrl.footer;

  	var x;

    for ( x in content)
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
    let path = null;

    if (this.platform.is('ios'))
    {
       path = this.file.documentsDirectory;
    }
    else
    {
       path = this.file.dataDirectory;
    }

    const transfer = this.transfer.create();
    transfer.download(MyApp.document_url + doc.localpath, path + doc.localpath).then(entry => {
      let url = entry.toURL();
      this.document.viewDocument(url, 'application/pdf',{});
    });
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
