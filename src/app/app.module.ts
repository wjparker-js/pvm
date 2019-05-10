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
import { DefectsPage }  from '../pages/defects/defects';
import { SubtypesPage } from '../pages/subtypes/subtypes';
import { QrcodePage } from '../pages/qrcode/qrcode';
import { LocationmapPage } from '../pages/locationmap/locationmap';
import { DisciplinePage } from '../pages/discipline/discipline';
import { EffectsPage } from '../pages/effects/effects';
import { ReasonsPage } from '../pages/reasons/reasons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DocumentTabs }    from '../pages/documenttabs/documenttabs';
import { DocumentIssues }  from '../pages/documenttabs/documentissues/documentissues';
import { DocumentAudit }   from '../pages/documentaudit/documentaudit';
import { DocumentSummary } from '../pages/documentsummary/documentsummary';
import { CallNumber } from '@ionic-native/call-number';
import { WeatherProvider } from '../providers/weather/weather'
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';


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
    DefectsPage,
    SubtypesPage,
    QrcodePage,
    LocationmapPage,
    DisciplinePage,
    EffectsPage,
    ReasonsPage,
    TabsPage,
    DocumentTabs,
    DocumentAudit,
    DocumentIssues
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
    DefectsPage,
    SubtypesPage,
    QrcodePage,
    LocationmapPage,
    DisciplinePage,
    EffectsPage,
    ReasonsPage,
    TabsPage,
    DocumentTabs,
    DocumentAudit,
    DocumentIssues,
    DocumentSummary   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    SplitPane,
    Common,
    BarcodeScanner,
    Geolocation,
    CallNumber,
    WeatherProvider,
    Camera,
    File,
    FileTransfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}   

  ]
})

export class AppModule {}