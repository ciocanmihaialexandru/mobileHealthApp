import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalVariable} from "../../app/global";
import {AuthProvider} from "../../providers/auth/auth";
import {Headers, Http} from "@angular/http";
import {JwtHelper, AuthHttp} from "angular2-jwt";

/**
 * Generated class for the IndexPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {

  LOGIN_URL: string = GlobalVariable.BASE_URL + '/api/login';
  SIGNUP_URL: string = GlobalVariable.BASE_URL + "/mobileApi/signup";
  PROFILE_INFO_URL: string = GlobalVariable.BASE_URL + "/mobileApi/showProfileInfo";

  auth: AuthProvider;
  authType: string = "login";
  contentHeader: Headers = new Headers({"Content-Type":"application/json"});
  error: string;
  success: string;
  jwtHelper: JwtHelper = new JwtHelper();
  user: string;
  loginCreds: any = {};

  // fitbitprofile informations
  firstName: string;
  lastName: string;
  height: string;
  weight: string;
  gender: string;
  memberSince: string;
  dateOfBirth: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private authHttp: AuthHttp) {
    this.auth = AuthProvider;
    let token = localStorage.getItem('token');

    if (token) {
      this.user = this.jwtHelper.decodeToken(token).sub;

      let postInformations = {username : this.user};

      if (AuthProvider.authenticated()) {
        this.authHttp.post(this.PROFILE_INFO_URL, JSON.stringify(postInformations), { headers: this.contentHeader })
          .map(res => res.json())
          .subscribe(data => {
            console.log(data)
            this.lastName = data.lastName;
            this.firstName = data.firstName;
            this.height = data.height;
            this.weight = data.weight;
            this.gender = data.gender;
            this.memberSince = data.memberSince;
            this.dateOfBirth = data.dateOfBirth;
          })
      }
    }

  }

  login(credentials) {

    this.success = ""
    this.error = ""

    if(credentials.username == "" || credentials.password == "") {
      this.error = "User name and password should be provided!"
    } else {
      this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => {
            this.error = "";
            this.authSuccess(data.access_token);
            this.navCtrl.setRoot(IndexPage)
          },
          err => {
            console.log(err)
            this.success = ""
            if(err.status == 401) {
              this.error = "Invalid password and/or username.";
            }
            if(err.status == 400) {
              this.error = "Invalid call to the server.";
            }
          }
        );
    }
  }

  signup(credentials) {

    this.success = ""
    this.error = ""

    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => {
          this.error = "";
          if (data.registration == "true") {
            this.authType = 'login'
            this.success = "Account created successfully!"
          } else {
            this.error = "Validation errors! Please retry."
          }
        },
        err => {
          this.success = ""
          console.log(err)
          if(err.status == 400) {
            this.error = err._body;
          }
        }
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    localStorage.setItem('token', token);
    var tokenData = this.jwtHelper.decodeToken(token);
    this.user = tokenData.sub
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  onChangeTabs() {
    this.success = ""
    this.error = ""
  }

}
