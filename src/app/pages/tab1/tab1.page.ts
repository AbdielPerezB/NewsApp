import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { NewsResponse } from '../../interfaces';
import { Article } from '../../interfaces/index';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  public articles: Article[] = []; 

  constructor(private newsService: NewsService) {}

  ngOnInit(){
    this.newsService.getTopHeadLine()
    .subscribe( (articles) =>{
                  this.articles.push(...articles);
                }
      );
  }

  loadData(){
    this.newsService.getTopHeadLinesByCategory('business', true)
    .subscribe( (resp) => {
      console.log(resp.length);
      if(resp.length === this.articles.length){
        this.infiniteScroll.disabled = true;
        return;
      }

      this.articles = resp;
      this.infiniteScroll.complete();

    });

  }

}
