import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, NewsResponse } from '../interfaces';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getTopHeadLine():Observable<Article[]>{//Esto significa que va a regresar un observable de un arreglo de articulos
    //Passing apiKey using url
    // return this.http.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`);

    //Passing apiKey by params
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
                          params:{apiKey}
                        }).pipe(
                          map(resp => resp.articles)
                        );
  }
}
