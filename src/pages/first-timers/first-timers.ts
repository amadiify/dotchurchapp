import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {FooterProvider} from '../../providers/footer/footer';
import {DashboardPage} from '../dashboard/dashboard';
import {Http} from '@angular/http';
import {MyApp} from '../../app/app.component';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-first-timers',
    templateUrl: 'first-timers.html',
})
export class FirstTimersPage {

    footer: any;
	data: any;
    logo: string;
    avatar: any;
    churchid: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public footerCtrl: FooterProvider, private http: Http, public loader: LoadingController,
                public alertCtrl: AlertController, private storage: Storage) {
        this.data = new Function();
        this.footer = this.footerCtrl.footer;
        this.logo = 'assets/imgs/logoe.png';

        this.storage.get("user").then((row) => {
            if (row !== null) {
                if (row.avatar != "hello.png") {
                    this.avatar = row.avatar;
                }
                else {
                    this.avatar = MyApp.defaultImage;
                }

            }
        });

        this.storage.get("churchid").then((id) => {
            this.churchid = id;
        });

    }

    ionViewDidLoad() {
        console.log('');
    }

    register(formValues) {
        // Create an array of our our checks and then check if it contains false.
        var checks = {
            "Title": "title" in formValues,
            "Full name": "fullname" in formValues,
            "Telephone": "telephone" in formValues,
            "Email address": "email" in formValues,
//          address: "address" in formValues, // optional
//          invitee: "invitee" in formValues, // optional
//          prayer: "prayer" in formValues,   // optional
            "Interested to join": "intrested" in formValues,
            "GDPR": "gdpr" in formValues ? formValues["gdpr"] == true : false // Needs to be checked!
        };

        // Optional check: if the user is not interested
        // uncomment if you want the specify to be required
        //      if (checks.intrested && !formValues['intrested'])
        //         checks['specify'] = "specify" in formValues;
        var missing = [];
        var missingValues = false;
        for (var key in checks) {
            if (checks.hasOwnProperty(key)) {
                var value = checks[key];

                if (!value) {
                    missingValues = true;
                    missing.push("- " + key);
                }
            }
        }

        if (missingValues) {
            this.alertCtrl.create({
                title: "Missing values in form!",
                subTitle: missing.join("<br>") + "<br><br>Are required values!",
                buttons: ['Ok']
            }).present();

            return;
        }

        var formdata = new FormData;

        for (var x in formValues)
            formdata.append("firsttimer[" + x + "]", formValues[x]);

        let loading = this.loader.create({
            content: "Adding first timer..",
            duration: 40000,
            dismissOnPageChange: true
        });

        loading.present();
        let apiRequestURI = MyApp.sermon_api + 'firstTimer/' + this.churchid;

        this.http.post(apiRequestURI, formdata).map(res => res.json())
        .subscribe(res => {
            console.log("Result from the server!", res);
            if (res.status == 'success') {
                loading.dismiss();

                this.alertCtrl.create({
                    title: formValues.fullname + " added",
                    subTitle: "Data saved successfully. ",
                    buttons: [
                        {
                            text: 'Ok',
                            role: 'continue',
                            handler: () => {
                                this.data = new Function();
                            }
                        }
                    ]
                }).present();

                this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
        }, error => {
            this.alertCtrl.create({
                title: "Something went wrong!",
                subTitle: "Check your internet connectivity",
                buttons: ['Ok']
            }).present();

            loading.dismiss();
        });
    }

    goback() {
        this.navCtrl.setRoot(DashboardPage);
    }

}
