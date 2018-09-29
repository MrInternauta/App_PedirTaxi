import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViajesPage } from './viajes';

@NgModule({
  declarations: [
    ViajesPage,
  ],
  imports: [
    IonicPageModule.forChild(ViajesPage),
  ],
})
export class ViajesPageModule {}
