import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {GlobalVariable} from "../../app/global";
import {AuthHttp} from 'angular2-jwt';

/*
  Generated class for the NotificationsDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationsDataProvider {

  contentHeader:  Headers = new Headers({"Content-Type":"application/json"});

  constructor(public http: Http, public authHttp: AuthHttp) {
    console.log('Hello NotificationsDataProvider Provider');
  }

  listNotifications(user) {
    return this.authHttp.post(GlobalVariable.API_URL, {username: user}, { headers: this.contentHeader }).map((res) => res.json());
  }
}
