import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AuthService } from '../providers/auth-service';
import { SplitPane } from '../providers/split-pane';
import { Common } from '../providers/common';
import { HttpModule } from "@angular/http";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Login } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { DocumentsPage } from '../pages/documents/documents';
import { DocumentViewer } from '../pages/documentviewer/documentviewer';
import { DocumentInfo } from '../pages/documentinfo/documentinfo';
import { ProjectsPage } from '../pages/projects/projects';
import { SnaggingPage } from '../pages/snagging/snagging';
import { QrcodePage } from '../pages/qrcode/qrcode';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DocumentTabs }    from '../pages/documenttabs/documenttabs';
import { DocumentIssues }  from '../pages/documenttabs/documentissues/documentissues';
import { DocumentAudit }   from '../pages/documentaudit/documentaudit';
import { DocumentInfoAll } from '../pages/documenttabs/documentinfoall/documentinfoall';
import { DocumentSummary } from '../pages/documentsummary/documentsummary';
import { CallNumber } from '@ionic-native/call-number';
import { WeatherProvider } from '../providers/weather/weather'


@NgModule({
  declarations: [
    MyApp,
    Login,
    AboutPage,
    ContactPage,
    HomePage,
    DocumentsPage,
    DocumentViewer,
    DocumentInfo,
    ProjectsPage,
    DocumentSummary,
    SnaggingPage,
    QrcodePage,
    TabsPage,
    DocumentTabs,
    DocumentAudit,
    DocumentIssues,
    DocumentInfoAll
  ],
  imports: [
    BrowserModule,HttpModule,NgxQRCodeModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
          ios: {
            statusbarPadding: true,
            tabsHideOnSubPages: true
          }
        }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    AboutPage,
    ContactPage,
    HomePage,
    DocumentsPage,
    DocumentViewer,
    DocumentInfo,
    ProjectsPage,
    SnaggingPage,
    QrcodePage,
    TabsPage,
    DocumentTabs,
    DocumentAudit,
    DocumentIssues,
    DocumentInfoAll,
    DocumentSummary   
  ],
  providers: [
    StatusBar,
    SplashScreen,AuthService,SplitPane,Common,CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WeatherProvider,BarcodeScanner
  ]
})

export class AppModule {}