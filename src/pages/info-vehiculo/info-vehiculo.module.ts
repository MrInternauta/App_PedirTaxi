import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoVehiculoPage } from './info-vehiculo';

@NgModule({
  declarations: [
    InfoVehiculoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoVehiculoPage),
  ],
})
export class InfoVehiculoPageModule {}
