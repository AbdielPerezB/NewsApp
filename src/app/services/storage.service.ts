import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // private _storage: Storage | null = null;
  private _storage!: Storage;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async saveRemoveArticle(article: Article){

    const exists = this._localArticles.find(localArticle => localArticle.title === article.title);
    if(exists){
      this._localArticles = this._localArticles.filter(localArticle => localArticle.title != article.title);
    }else{
      this._localArticles = [article, ...this._localArticles];
    }

    this._storage.set('articles', this._localArticles);

  }
}
