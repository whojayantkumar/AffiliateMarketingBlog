import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Posts } from './post.model';
import {map} from 'rxjs/operators'
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  error =new Subject<string>();

  constructor(private http: HttpClient, private authService: AuthService) { }
  createAndStorePost(postData: Posts){
    // const postData: Posts = {title:title, content:content}
    this.http.post<{name: string}>("https://ng-complete-guide-89b79-default-rtdb.firebaseio.com/posts.json?auth=" + this.authService.token,postData).subscribe(responseData =>{
    console.log(responseData);
    }, error =>{
      this.error.next(error.message);
    });
  }
  fetchPosts(){
    return this.http.get<{[key: string]: Posts}>("https://ng-complete-guide-89b79-default-rtdb.firebaseio.com/posts.json").pipe(map(responseData =>{
      const postsArray: Posts[] = [];
      for (const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postsArray.push({ ...responseData[key], id: key})
        }
        
      }
      return postsArray;
    }));
  }

  deletePost(){
    return this.http.delete("https://ng-complete-guide-89b79-default-rtdb.firebaseio.com/posts.json");
  }
}
