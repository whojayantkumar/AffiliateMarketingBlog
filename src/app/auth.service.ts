import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject} from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "./user.model";

interface AuthResponseData{
    kind: string,
    idToken: string,
    email : string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered? : boolean;
}

@Injectable({providedIn: "root"})
export class AuthService{
    private tokenExpirationTimer : any;
    user = new BehaviorSubject<User>(null);
    token : string = null;
    constructor(private http: HttpClient, private router: Router){}
    signup(email: string, password: string){
     return   this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAaWGiBpi7OndDhSGUYR9LAZ5S6Y1XeWBk",
            {
                email: email,
                password: password,
                returnSecureToken: true

            }).pipe(tap(responseData=>{
                this.HandleAuthentication(responseData.email,responseData.localId,responseData.idToken,+responseData.expiresIn);
            }))
    }
    autoLogin(){
        const userData =JSON.parse(localStorage.getItem('userData')) ;
        if (!userData){
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token){
            this.user.next(loadedUser);
            this.token = userData._token;
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }
    login(email:string, password: string){
      return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAaWGiBpi7OndDhSGUYR9LAZ5S6Y1XeWBk",{
            email: email,
            password: password,
            returnSecureToken: true,
        }).pipe(tap(responseData=>{
            this.HandleAuthentication(responseData.email,responseData.localId,responseData.idToken,+responseData.expiresIn);
        }))

    }
    logout(){
        this.router.navigate(['/login']);
        this.user.next(null);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer =null;
    }

    autoLogout(expirationDuration : number){
       this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();
        },expirationDuration)
    }

    private HandleAuthentication(email: string, userId:string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn *1000);
            const user = new User(email,userId,token,expirationDate);
            this.token = token;
            this.user.next(user);
            this.autoLogout(expiresIn * 1000)
            localStorage.setItem('userData',JSON.stringify(user));
    }

}