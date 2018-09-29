import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoPerfilPage } from './info-perfil';

@NgModule({
  declarations: [
    InfoPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoPerfilPage),
  ],
})
export class InfoPerfilPageModule {}
