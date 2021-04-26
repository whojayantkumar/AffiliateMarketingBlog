import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Posts } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {
  loadedPosts: Posts[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) { }

  ngOnInit() {
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

  onCreatePost(postData: Posts, form : NgForm) {
    // Send Http request
    this.postsService.createAndStorePost(postData);
    setTimeout(() => {
      this.onFetchPosts();
    }, 500)
    form.reset();

  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching =false;
      this.error = error.message;
    });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePost().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  onHandleError() {
    this.error = null;
  }
  ngOnDestroy() {
    this.errorSub.unsubscribe()
  }

}
