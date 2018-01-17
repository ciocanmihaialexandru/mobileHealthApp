import {Injectable} from "@angular/core";
import {tokenNotExpired} from 'angular2-jwt';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
  constructor() {}

  public static authenticated() {
    return tokenNotExpired('token');
  }
}
