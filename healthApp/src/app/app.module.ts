import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {IndexPage} from "../pages/index/index";
import {NotificationsPage} from "../pages/notifications/notifications";
import {NotificationsDataProvider} from "../providers/notifications-data/notifications-data";
import {HttpModule, Http} from "@angular/http";
import { AuthProvider } from '../providers/auth/auth';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import { TrackingLocationProvider } from '../providers/tracking-location/tracking-location';
import {Geolocation} from "@ionic-native/geolocation";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation";
import {LocationPage} from "../pages/location/location";

@NgModule({
  declarations: [
    MyApp,
    IndexPage,
    NotificationsPage,
    LocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IndexPage,
    NotificationsPage,
    LocationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NotificationsDataProvider,
    AuthProvider,
    {provide: AuthHttp, useFactory: (http) => {
      return new AuthHttp(new AuthConfig, http);
    },
      deps: [Http]},
    TrackingLocationProvider,
    Geolocation,
    BackgroundGeolocation
  ]
})
export class AppModule {}
