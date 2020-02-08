import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { FooterProvider } from '../../providers/footer/footer';

@IonicPage()
@Component({
  selector: 'page-showsermon',
  templateUrl: 'showsermon.html',
})
export class ShowsermonPage {

  title : string;
  pastor : any;
  sermon : any;
  image = MyApp.app_image;
  Myapp = MyApp;
  footer : any;
  video : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public footerCtrl : FooterProvider) {
      this.sermon = navParams.get("data");
      this.pastor = navParams.get("res");
      this.title = this.sermon.sermonTopic;
      this.footer = footerCtrl.footer;
      this.video = this.sermon.sermonVideo;
  }

  ionViewDidLoad() {
  }

  loadVideo(video)
  {
    var videoLayer = document.querySelector('#videoLayer');

    videoLayer.innerHTML = video;

    var iframe = videoLayer.firstElementChild;

    if (iframe != null)
    {
        iframe.removeAttribute('width');
        iframe.removeAttribute('height');

        iframe.setAttribute('style', 'width:100%; height:300px;');
    }
  }

}
