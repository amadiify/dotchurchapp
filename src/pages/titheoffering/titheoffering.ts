import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {FooterProvider} from '../../providers/footer/footer';
import {MyApp} from '../../app/app.component';
import {Storage} from '@ionic/storage';
import {DashboardPage} from '../dashboard/dashboard';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {TransdetailPage} from '../transdetail/transdetail';

@IonicPage()
@Component({
    selector: 'page-titheoffering',
    templateUrl: 'titheoffering.html',
})
export class TitheofferingPage {

    footer: any;
    avatar: any;
    image = MyApp.app_image;
    defaultimage: string;
    transactions: any;
    churchid: any;
    loaded: boolean;
    total: number = 0;
    offering: number = 0;
    tithe: number = 0;
    donation: number = 0;
    today : any = "";
    gifts : number = 0;
    tithes : number = 0;
    offerings : number = 0;
    thanksgiving : number = 0;
    options : any = 'view';
    envelope : any = {};
    programs : any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public footerCtrl: FooterProvider,
                private storage: Storage,
                public http: Http,
                public loader: LoadingController,
	            public alertCtrl: AlertController){
        this.footer = footerCtrl.footer;
        this.loaded = false;
        this.storage.get("user").then((row) => {

            this.defaultimage = '../assets/imgs/men3.jpg';
            if (row.avatar == "hello.png") {
                this.avatar = MyApp.defaultImage;
            }
            else {
                this.avatar = this.image + row.avatar;
            }

        });

        this.storage.get('givings').then((res) => {
            this.today = res.Date;
            this.offerings = res.Offering;
            this.gifts = res.Gift;
            this.tithes = res.Tithe;
            this.thanksgiving = res.Thanksgiving;
            this.total = res.Total;
        });

        // get all programs
        if (this.programs == false)
        {
            this.loadPrograms();
        }
    }

    loadPrograms()
    {
        var loader = this.loader.create({
            content: '',
            duration: 40000,
            dismissOnPageChange: false,
            enableBackdropDismiss: false
        });

        loader.present();

        this.storage.get('churchid').then(churchid => {
            var response = this.http.get(MyApp.sermon_api + 'programs/'+churchid).map(res => res.json());
            response.subscribe(res => {
                loader.dismiss();
                this.programs = res;
            });
        });
    }

    loadAll() {
        return this.http.get(MyApp.sermon_api + 'allgivers/' + this.churchid).map(res => res.json());
    }

    details(data) {
        this.navCtrl.push(TransdetailPage, {data});
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

    ionViewDidLoad() {
    }

    processDonation(envelope:any)
    {
        if (envelope.type != null && envelope.amount !== null && envelope.idno !== null) {

			var formdata = "";

			var loader = this.loader.create({
				content: 'Contacting Dotchurch...',
				duration: 40000,
				dismissOnPageChange: false,
				enableBackdropDismiss: false
			});

            if (parseInt(envelope.amount) > 0) 
            {
                loader.present();

                this.storage.get('churchid').then(churchid => {

                formdata += "givingtype=" + envelope.type;
				formdata += "&amount=" + envelope.amount;
				formdata += "&memberid=" + MyApp.session_id;
				formdata += "&churchid=" + churchid;
                formdata += "&date=" + envelope.date;
                formdata += "&specify=" + envelope.specify;
                formdata += "&programid=" + envelope.programid; 


                var inputs = document.querySelectorAll("input");

                [].forEach.call(inputs, (e:any) => {
                    e.value = "";
                });

                var select = document.querySelectorAll("select");

                [].forEach.call(select, (e:any) => {
                    e.selected = "";
                    e.value = "";
                });
                
                this.http.get(MyApp.sermon_api + 'manualEntry?' + formdata).map(res => res.json())
                .subscribe(res => {
                    var title = res.status == 'error' ? 'Entry failed' : 'Success';

                    loader.dismiss();
                    
                    this.alertCtrl.create({
                        title : title,
                        subTitle : res.message,
                        buttons : ['Ok']
                    }).present();
                });

                });
			}
			else {
				this.alertCtrl.create({
					title: "Invalid Amount",
					subTitle: "Amount must be numeric",
					buttons: ['Ok']
				}).present();
			}

		}
		else {
			this.alertCtrl.create({
				title: "All fields are required",
				subTitle: "Please enter all fields correctly",
				buttons: ['Ok']
			}).present();
		}
    }
}
