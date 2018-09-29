import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InternetPage } from './internet';

@NgModule({
  declarations: [
    InternetPage,
  ],
  imports: [
    IonicPageModule.forChild(InternetPage),
  ],
})
export class InternetPageModule {}
