import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http'; //Si es un modulo se agrega en imports
import { IonicStorageModule } from '@ionic/storage-angular';

//Plugins
import { InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            HttpClientModule,
            IonicStorageModule.forRoot()
          ],
  providers: [
              { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
              InAppBrowser,
              SocialSharing
            ],
  bootstrap: [AppComponent],
})
export class AppModule {}
