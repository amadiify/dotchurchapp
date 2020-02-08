import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {AppUsers} from '../providers/app-users/app-users';
import {DashboardPage} from '../pages/dashboard/dashboard';
import {SermonsProvider} from '../providers/sermons/sermons';
import {ShowsermonPage} from '../pages/showsermon/showsermon';
import {PastorDeskPage} from '../pages/pastor-desk/pastor-desk';
import {PastorsProvider} from '../providers/pastors/pastors';
import {PastorInfoPage} from '../pages/pastor-info/pastor-info';
import {PastorMessagesPage} from '../pages/pastor-messages/pastor-messages';
import {PastorSermonsPage} from '../pages/pastor-sermons/pastor-sermons';
import {ProfilePage} from '../pages/profile/profile';
import {FooterProvider} from '../providers/footer/footer';
import {ReadmessagePage} from '../pages/readmessage/readmessage';
import {IonicStorageModule} from '@ionic/storage';
import {AttendantPage} from '../pages/attendant/attendant';
import {MembersPage} from '../pages/members/members';
import {MemberinfoPage} from '../pages/memberinfo/memberinfo';
import {EnvelopePage} from '../pages/envelope/envelope';
import {EvangelismPage} from "../pages/evangelism/evangelism";
import {MemberslistPage} from '../pages/memberslist/memberslist';
import {SpirometerPage} from '../pages/spirometer/spirometer';
import {SpirometerinfoPage} from '../pages/spirometerinfo/spirometerinfo';
import {TitheofferingPage} from '../pages/titheoffering/titheoffering';
import {RegistrationPage} from '../pages/registration/registration';
import {TransdetailPage} from '../pages/transdetail/transdetail';
import {NewarticlePage} from '../pages/newarticle/newarticle';
import {MyarticlesPage} from '../pages/myarticles/myarticles';
import {PendingarticlesPage} from '../pages/pendingarticles/pendingarticles';
import {LoginPage} from '../pages/login/login';
import {AttendanceinfoPage} from '../pages/attendanceinfo/attendanceinfo';
import {IncomePage} from '../pages/income/income';
import {ExpenditurePage} from '../pages/expenditure/expenditure';
import {DepartmentheadPage} from '../pages/departmenthead/departmenthead';
import {FirstTimersPage} from '../pages/first-timers/first-timers';
import {BudgetsPage} from '../pages/budgets/budgets';
import {AddattendancePage} from '../pages/addattendance/addattendance';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {Camera} from '@ionic-native/camera';
import {FileTransfer} from '@ionic-native/file-transfer';
import {LoginpinPage} from '../pages/loginpin/loginpin';
import { LibraryPage } from '../pages/library/library';
import { DocumentViewer } from '@ionic-native/document-viewer';
import {WhatsnewPage} from '../pages/whatsnew/whatsnew';
import { ResetPage } from '../pages/reset/reset';
import { File } from '@ionic-native/file';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		DashboardPage,
		EvangelismPage,
		ShowsermonPage,
		PastorDeskPage,
		PastorInfoPage,
		PastorMessagesPage,
		PastorSermonsPage,
		ProfilePage,
		ReadmessagePage,
		FooterProvider,
		AttendantPage,
		MembersPage,
		MemberinfoPage,
		EnvelopePage,
		MemberslistPage,
		SpirometerPage,
		SpirometerinfoPage,
		TitheofferingPage,
		RegistrationPage,
		TransdetailPage,
		NewarticlePage,
		MyarticlesPage,
		PendingarticlesPage,
		LoginPage,
		AttendanceinfoPage,
		IncomePage,
		ExpenditurePage,
		DepartmentheadPage,
		FirstTimersPage,
		BudgetsPage,
		AddattendancePage,
		LoginpinPage,
        LibraryPage,
        WhatsnewPage,
        ResetPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot(),
		HttpModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		DashboardPage,
		EvangelismPage,
		PastorDeskPage,
		ShowsermonPage,
		PastorInfoPage,
		PastorMessagesPage,
		PastorSermonsPage,
		ProfilePage,
		ReadmessagePage,
		AttendantPage,
		MembersPage,
		MemberinfoPage,
		EnvelopePage,
		MemberslistPage,
		SpirometerPage,
		SpirometerinfoPage,
		TitheofferingPage,
		RegistrationPage,
		TransdetailPage,
		NewarticlePage,
		MyarticlesPage,
		PendingarticlesPage,
		LoginPage,
		AttendanceinfoPage,
		IncomePage,
		ExpenditurePage,
		DepartmentheadPage,
		FirstTimersPage,
		BudgetsPage,
		AddattendancePage,
		LoginpinPage,
        LibraryPage,
        WhatsnewPage,
        ResetPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AppUsers,
		Camera,
		FileTransfer,
		SermonsProvider,
		PastorsProvider,
		FooterProvider,
		InAppBrowser,
        DocumentViewer,
        File
	]
})
export class AppModule {}
