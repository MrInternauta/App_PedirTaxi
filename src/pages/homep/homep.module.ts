import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomepPage } from './homep';

@NgModule({
  declarations: [
    HomepPage,
  ],
  imports: [
    IonicPageModule.forChild(HomepPage),
  ],
})
export class HomepPageModule {}
