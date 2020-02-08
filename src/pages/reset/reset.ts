import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {
	
  logo : any;
  user : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private http: Http, private loading: LoadingController, private alrt: AlertController)
  {
  	this.logo = 'assets/imgs/logoe.png';
  	this.user = new Object();
  }

  recover()
  {
  	 let username = "", email = "", password = "", loading, alertc;

  	 username = this.user.username;
  	 email = this.user.email;
  	 password = this.user.password;

  	 loading = this.loading.create({
  	 	content : 'Please wait',
  	 	duration : 40000,
  	 	dismissOnPageChange : false
  	 });

  	 alertc = this.alrt;

  	 function a_lert(text, title)
  	 {
  	 	alertc.create({
  	 		title : title,
  	 		subTitle : text,
  	 		buttons : ['Ok']
  	 	}).present();
  	 }

  	 if (username.length > 1 && email.length > 0 && password.length > 0)
  	 {
  	 	let formdata = new FormData();

  	 	formdata.append('email', email);
  	 	formdata.append('username', username);
  	 	formdata.append('new_password', password);

  	 	loading.present();

  	 	this.http.post(MyApp.sermon_api + 'recover', formdata).map(res => res.json()).subscribe(res => {
  	 		loading.dismiss();
			   a_lert(res.message, res.title);
			   
			if (res.title == 'Success')
			{
				this.navCtrl.push(LoginPage);
			}
  	 	});
  	 }	
  }

  ionViewDidLoad() {
  }

}
