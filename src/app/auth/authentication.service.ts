import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authServer = "http://localhost:8080/backsite/login-api.php"
  private currentUserSubject: BehaviorSubject<any>;
  private currentUser: Observable<any>;

  constructor(private http: HttpClient,
    private router: Router) {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('token')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(){
    return this.currentUserSubject.value;
  }

  signIn(logindetails){
    return this.http.post<any>(this.authServer, logindetails).pipe(
      map(data => {
        if(data && data.jwt){
          console.log(data);
          localStorage.setItem('token', data.jwt);
          this.currentUserSubject.next(data);
          console.log(this.currentUserSubject.value);
          console.log(this.currentUser);
          return true;
        }
        else
          return false;
      })
    )
  }

  isAuthenticated(){
    const token = localStorage.getItem('token');
    if(token === null){
      this.router.navigateByUrl('/login');
      return false;
    }
    else
      return true;
  }

  currentRoleGetter(){
    const token = localStorage.getItem('token');
    
    if(token){
      const decodedToken = jwt_decode(token);
      const tokenPayload = decodedToken['data'];
      console.log(tokenPayload.role);
      return tokenPayload.role
    }
    else
      return null;
  }

  signOut(){
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }


  




}
