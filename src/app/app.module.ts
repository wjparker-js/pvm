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
import { DocumentIdInfo } from '../pages/documentidinfo/documentidinfo';
import { ProjectsPage } from '../pages/projects/projects';
import { SnaggingPage } from '../pages/snagging/snagging';
import { Snagging51Page } from '../pages/snagging51/snagging51';
import { Snagging52Page } from '../pages/snagging52/snagging52';
import { DefectsPage }  from '../pages/Defects/defects';
import { DefectsviewPage }  from '../pages/defectsview/defectsview';
import { SubtypesPage } from '../pages/subtypes/subtypes';
import { QrcodePage } from '../pages/qrcode/qrcode';
import { LocationmapPage } from '../pages/locationmap/locationmap';
import { DisciplinePage } from '../pages/discipline/discipline';
import { EffectsPage } from '../pages/effects/effects';
import { ReasonsPage } from '../pages/reasons/reasons';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DocumentTabs }    from '../pages/documenttabs/documenttabs';
import { DocumentIssues }  from '../pages/documenttabs/documentissues/documentissues';
import { DocumentAudit }   from '../pages/documentaudit/documentaudit';
import { DocumentSummary } from '../pages/documentsummary/documentsummary';
import { CallNumber } from '@ionic-native/call-number';
import { WeatherProvider } from '../providers/weather/weather'
import { Camera } from '@ionic-native/camera';
import { DrawingProvider } from '../providers/drawing/drawing';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Keyboard } from '@ionic-native/keyboard';
import { ImgViewPage } from '../pages/imgview/imgview';
import { ImgEditPage } from '../pages/imgedit/imgedit';
import { ImgEditPagePre } from '../pages/imgeditpre/imgeditpre';
import { ImgEditPagePostPost } from '../pages/imgeditpostpost/imgeditpostpost';
import { ImgEditPagePost } from '../pages/imgeditpost/imgeditpost';
import { ColorsPopoverPage } from '../pages/colors-popover/colors-popover';
import { WidthPopoverPage } from '../pages/width-popover/width-popover';
import { BrushTypePopoverPage } from '../pages/brush-type-popover/brush-type-popover';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';


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
    DocumentIdInfo,
    ProjectsPage,
    DocumentSummary,
    SnaggingPage,
    Snagging51Page,
    Snagging52Page,
    DefectsPage,
    DefectsviewPage,
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
    ImgViewPage,
    ImgEditPage,
    ImgEditPagePre,
    ImgEditPagePostPost,
    ImgEditPagePost,
    ColorsPopoverPage,
    WidthPopoverPage,
    BrushTypePopoverPage
  ],
  imports: [
    BrowserModule,HttpModule,NgxQRCodeModule,IonicImageViewerModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      platforms: {
          ios: {
            statusbarPadding: true,
            tabsHideOnSubPages: true
          },
          android: {
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
    DocumentIdInfo,
    ProjectsPage,
    SnaggingPage,
    Snagging51Page,
    Snagging52Page,
    DefectsPage,
    DefectsviewPage,
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
    DocumentSummary,
    ImgViewPage,
    ImgEditPage,
    ImgEditPagePre,
    ImgEditPagePostPost,
    ImgEditPagePost,
    ColorsPopoverPage,
    WidthPopoverPage,
    BrushTypePopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    SplitPane,
    Network,
    Common,
    BarcodeScanner,
    Geolocation,
    NativeGeocoder,
    CallNumber,
    WeatherProvider,
    Keyboard,
    Camera,
    File,
    FileTransfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DrawingProvider
     
  ]
})

export class AppModule {}