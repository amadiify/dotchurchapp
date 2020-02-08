import {Component} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ModalController,
	ActionSheetController,
	LoadingController,
	AlertController
} from 'ionic-angular';
import {DashboardPage} from '../dashboard/dashboard';
import {Storage} from '@ionic/storage';
import {MyApp} from '../../app/app.component';
import {Http} from '@angular/http';
import {PropCri, PropertyValidator} from "../../app/Lib/PropertyValidator";

interface IEvangelismForm {
	title: string;
	fullname: string;
	telephone: string;
	email: string;
	address: string;
	gender: string;
	christian: string | boolean;
	saved: string | boolean;
	churchid: any;
}

@IonicPage()
@Component({
	selector: 'page-evangelism',
	templateUrl: 'evangelism.html',
})
export class EvangelismPage {
	image = MyApp.app_image;
	defaultimage: any;
	churchid: any;
	memberid: any;
	avatar: string;
	clicked: boolean = false;
	data: Object | IEvangelismForm;
	logo: string;

	constructor(public navCtrl: NavController,
	            public navParams: NavParams,
	            public storage: Storage,
	            public Modal: ModalController,
	            public ActionSheet: ActionSheetController,
	            public loader: LoadingController,
	            public http: Http,
	            public alertCtrl: AlertController) {

		this.data = {};
		this.defaultimage = '../assets/imgs/men3.jpg';
		this.logo = 'assets/imgs/logoe.png';

		storage.get("user").then((row) => {
			if (row.avatar == "hello.png") {
				this.avatar = MyApp.defaultImage;
			}
			else {
				this.avatar = this.image + row.avatar;
			}

			this.memberid = row.memberid;
		});

		storage.get("churchid").then((id) => {
			this.churchid = id;
		});
	}

	ionViewDidLoad() {}

	register(data: IEvangelismForm)
	{
		// Validate the information
		if (PropertyValidator.PopupError({
				"Title": new PropCri("title"),
				"Fullname": new PropCri("fullname"),
				"Telephone": new PropCri("telephone"),
				"Email": new PropCri("email"),
				"Are you a Christian?": new PropCri("christian"),
				"Save and Baptized?": new PropCri("saved"),
				"GDPR": new PropCri("gdpr") }, data, this.alertCtrl)) {
			return;
		}

		let loading = this.loader.create({
			content: 'Please wait',
			duration : 40000
		});

		let alertc = this.alertCtrl;

		function a_lert(title, text)
		{
			alertc.create({
				title : title,
				subTitle : text,
				buttons : ['Ok']
			}).present();
		}

		// Convert the yes/no to boolean
		data.christian = (data.christian === "yes");
		data.saved = (data.saved === "yes");
		data.churchid = this.churchid;

		var form = new FormData;
		for (var x in data)
		{
			form.append(x, data[x]);
		}

		loading.present();

		this.http.post(MyApp.sermon_api + 'envangelism', form).map(res => res.json()).subscribe(res => {

			loading.dismiss();
			a_lert(res.title, res.message);
		});
	}

	goback() {
		if (this.navCtrl.canGoBack() == true) {
			this.navCtrl.pop();
		}
		else {
			this.navCtrl.insert(0, DashboardPage);
			this.navCtrl.pop();
		}
	}
}
