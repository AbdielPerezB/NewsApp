import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {}

  constructor(private http: HttpClient) { }

  private executeQuery<T>(endpoint: string){
    console.log('Peticion HTTP');
    return this.http.get<T>(`${apiUrl}${endpoint}`,{
      //Params
      params:{
        apiKey:apiKey,
        country: 'us'
      }
    });

  }

  getTopHeadLine():Observable<Article[]>{//Esto significa que va a regresar un observable y más específicamente un arreglo de articulos
    //Passing apiKey using url
    // return this.http.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`);

    //Passing apiKey by params
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
                          params:{apiKey}
                        }).pipe(
                          map(resp => resp.articles)
                        );
  }

  getTopHeadLinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]>{

    if(loadMore){
      return this.getArticlesByCategory(category);
    }

    //Si quiere la información que ya hay en memoria tenemos que confirmar que si exista dicha información
    if(this.articlesByCategoryAndPage[category]){
      //la función of de rxjs nos permite construir un observable basado en su argumento
      return of(this.articlesByCategoryAndPage[category].articles);
    }


    // return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`, {
    //                       params:{apiKey}
    //                     }).pipe(
    //                       map(resp => resp.articles)
    //                     );

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string):Observable<Article[]>{

    if(Object.keys(this.articlesByCategoryAndPage).includes(category)){
      //Ya existe
      // this.articlesByCategoryAndPage[category].page +=1
    }else{
      //No existe
      this.articlesByCategoryAndPage[category] = {
        page:0,
        articles: []
      }
    }

    //Aumenta el numero de pagina ya sea que ya existia la categoria en el arreglo o recien la creamos arriba
    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
    .pipe(
      // map( (resp) => resp.articles)// Esto es lo mismo que abajo
      map( ({articles}) => {

        //Cuando se ha llegado al tope de los articulos existentes en el API, esta regresa un artículo vació, so:
        if (articles.length === 0) return this.articlesByCategoryAndPage[category].articles;

        this.articlesByCategoryAndPage[category] = {
          page: page,
          // articles: articles
          articles: [...this.articlesByCategoryAndPage[category].articles, ...articles] //Esto hace un push de los nuevos articulos pero conserva los anteriores
        } 

        return this.articlesByCategoryAndPage[category].articles;
      })
    );
  }
}
