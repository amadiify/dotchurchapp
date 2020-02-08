import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, DateTime} from 'ionic-angular';
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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public footerCtrl: FooterProvider,
                private storage: Storage,
                public http: Http) {
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

}
