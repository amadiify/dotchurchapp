import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {DashboardPage} from '../pages/dashboard/dashboard';
import {PastorDeskPage} from '../pages/pastor-desk/pastor-desk';
import {PastorMessagesPage} from '../pages/pastor-messages/pastor-messages';
import {PastorSermonsPage} from '../pages/pastor-sermons/pastor-sermons';

import {HomePage} from '../pages/home/home';
import {AttendantPage} from '../pages/attendant/attendant';
import {MembersPage} from '../pages/members/members';
import {EnvelopePage} from '../pages/envelope/envelope';
import {EvangelismPage} from "../pages/evangelism/evangelism";
import {SpirometerPage} from '../pages/spirometer/spirometer';
import {TitheofferingPage} from '../pages/titheoffering/titheoffering';
import {PendingarticlesPage} from '../pages/pendingarticles/pendingarticles';
import {MyarticlesPage} from '../pages/myarticles/myarticles';
import {FirstTimersPage} from '../pages/first-timers/first-timers';
import {BudgetsPage} from '../pages/budgets/budgets';

//var app_url = "http://localhost:8888/2018-works/myworks/dotweb/";
var app_url = "https://www.dotchurch.co.uk/";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any = HomePage;

	pages = HomePage.appPages;

	static session_id = 0;
	static userRole: string;
	static loggedin_user: any;
	static notloggedin = true;
	static regPages = [];
	static app_api: string = app_url + '/rest/';
	static app_image: string = app_url + '/application/public/assets/images/';
	static sermon_api = app_url + "/sermon_api/";
	static defaultImage = "assets/imgs/men3.jpg";
	static appurl = app_url;
	static newArticle: boolean = false;
	static document_url : string = app_url + '/application/public/assets/document/';


	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public menu: MenuController,
		public splashScreen: SplashScreen) {

		this.initializeApp();

		let p = [];

		p['Dashboard'] = DashboardPage;
		p['Logout'] = HomePage;
		p['Pastor Desk'] = PastorDeskPage;
		p['My Sermons'] = PastorSermonsPage;
		p['My Messages'] = PastorMessagesPage;
		p['Attendance'] = AttendantPage;
		p['Members Data'] = MembersPage;
		p['Envelope'] = EnvelopePage;
		p['Evangelism'] = EvangelismPage;
		p['Spirometer'] = SpirometerPage;
		p['Tithe / Offering'] = TitheofferingPage;
		p['Library'] = PendingarticlesPage;
		p['My Articles'] = MyarticlesPage;
		p['First Timers'] = FirstTimersPage;
		p['Budget'] = BudgetsPage;

		MyApp.regPages = p;
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// // Here you can do any higher level native things you might need.
			// statusBar.styleDefault();
			// splashScreen.hide();

			this.statusBar.hide();
			this.splashScreen.hide();
		});
	}

	closeMenu() {
		this.menu.close();
	}

	openPage(page) {
		// close the menu when clicking a link from the menu
		this.menu.close();
		// navigate to the new page if it is not the current page
		var clicked: boolean = true;
		this.nav.setRoot(page.component, {clicked});
	}
}
