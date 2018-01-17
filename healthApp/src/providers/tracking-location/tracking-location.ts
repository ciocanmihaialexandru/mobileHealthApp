import {Injectable, NgZone} from "@angular/core";
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import {Http, Headers} from "@angular/http";
import {GlobalVariable} from "../../app/global";

/*
  Generated class for the TrackingLocationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TrackingLocationProvider {

  // variables for tracking location in foreground and background
  public watch: any;
  public lat: number = 0;
  public long: number = 0;

  // cutOffCoordinates
  public cutOffLat: number = 0;
  public cutOffLong: number = 0;

  contentHeader:  Headers = new Headers({"Content-Type":"application/json"});

  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation, public geolocation: Geolocation, public http: Http) {
    console.log('Hello TrackingLocationProvider Provider');
  }

  /**
   * setting cutoff coordinates
   */
  setCutoffCoords() {

    this.geolocation.getCurrentPosition().then((position) => {

      console.log("Current position: " + position.coords.latitude + "," + position.coords.longitude);

      this.cutOffLat = position.coords.latitude;
      this.cutOffLong = position.coords.longitude;
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * start tracking
   */
  startTracking() {

    // Background Tracking
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 10,
      distanceFilter: 5,
      debug: true,
      stopOnTerminate: true
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation: ' + location.latitude + ',' + location.longitude);

      this.zone.run(() => {

        this.http.post(GlobalVariable.BASE_URL + "/mobileApi/backgroundLogs", {position: location.latitude, cutoff: this.cutOffLat}, { headers: this.contentHeader })
          .map((res) => res.json())
          .subscribe(data => {
            console.log("received " + data);
          });
      });

      this.backgroundGeolocation.finish();

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log('Foreground position:' + position.coords.latitude + "," + position.coords.longitude);

    });
  }

  /**
   * stop tracking
   */
  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.stop();
    this.watch.unsubscribe();
    this.cutOffLat = 0;
    this.cutOffLong = 0;
  }
}
