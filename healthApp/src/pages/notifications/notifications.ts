import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {NotificationsDataProvider} from "../../providers/notifications-data/notifications-data";
import {AuthProvider} from "../../providers/auth/auth";
import {IndexPage} from "../index/index";
import {JwtHelper} from "angular2-jwt";

/**
 * Generated class for the NotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  items: any;
  auth: AuthProvider;
  user: string;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationData: NotificationsDataProvider) {

    this.auth = AuthProvider;
    let token = localStorage.getItem('token');

    if (token) {
      this.user = this.jwtHelper.decodeToken(token).sub;
    }

    if(AuthProvider.authenticated()) {
      this.listNotifications(this.user)
    } else {
      this.navCtrl.setRoot(IndexPage)
    }

  }

  listNotifications(user) {
    this.notificationData.listNotifications(user).subscribe(data => {
      this.items = data;
      console.log("Data" + JSON.stringify(this.items, null, 2));
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

}
