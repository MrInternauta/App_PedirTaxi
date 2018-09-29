import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmergenciaPage } from './emergencia';

@NgModule({
  declarations: [
    EmergenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(EmergenciaPage),
  ],
})
export class EmergenciaPageModule {}
