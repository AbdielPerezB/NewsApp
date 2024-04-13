import { Component, Input } from '@angular/core';
import { Article } from '../../interfaces';
import { InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article!: Article;
  @Input() i!: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCrtl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) { }

  openArticle(){
    if(this.platform.is('ios') || this.platform.is('android')){
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');
  }

  async onOpenMenu(){

    const normalButtons: ActionSheetButton[] = [
      {
        text: 'Add favorite',
        icon: 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancel',
        icon: 'close-outline',
        role: 'cancel'
      }
    ];

    const shareButton: ActionSheetButton = {
      text: 'Share',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if(this.platform.is('capacitor')){
      normalButtons.unshift(shareButton);
    }

    const actionsheet = await this.actionSheetCrtl.create({
      header: 'Opciones',
      buttons: normalButtons
    });
    await actionsheet.present();
  }

  onShareArticle(){
    // console.log('Share Article');
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      undefined,
      this.article.url
    );
  }

  onToggleFavorite(){
    // console.log('toggle favorite');
    this.storageService.saveRemoveArticle(this.article);
  }

}
