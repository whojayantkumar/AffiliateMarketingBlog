import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Posts } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loadedPosts: Posts[] = [];
  error = null;
  isFetching = false;
  private errorSub: Subscription;
  constructor(private http: HttpClient ,private postsService : PostsService) { }

  ngOnInit(){
    this.errorSub = this.postsService.error.subscribe(erroeMessage => {
      this.error = erroeMessage;
    });
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching =false;
      this.error = error.message;
    });
  }
  ngOnDestroy() {
    this.errorSub.unsubscribe()
  }

}
