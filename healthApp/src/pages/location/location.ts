import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TrackingLocationProvider} from "../../providers/tracking-location/tracking-location";
import {AuthProvider} from "../../providers/auth/auth";
import {IndexPage} from "../index/index";
import {JwtHelper} from "angular2-jwt";

/**
 * Generated class for the LocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {

  user: string;
  jwtHelper: JwtHelper = new JwtHelper();
  auth: AuthProvider;
  trackingStarted: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public trackingLocation: TrackingLocationProvider) {

    this.auth = AuthProvider;

    // if not authenticated, redirect to index page
    if(!AuthProvider.authenticated()) {
      this.navCtrl.setRoot(IndexPage);
    }

    // get current user
    let token = localStorage.getItem('token');
    if (token) {
      this.user = this.jwtHelper.decodeToken(token).sub;
    }

  }

  setLocation() {
    this.trackingLocation.setCutoffCoords();
  }

  startTracking() {
    this.trackingLocation.startTracking();
    this.trackingStarted = true;
  }

  stopTracking() {
    this.trackingLocation.stopTracking();
    this.trackingStarted = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

}
