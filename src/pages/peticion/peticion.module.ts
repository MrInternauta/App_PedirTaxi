import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeticionPage } from './peticion';

@NgModule({
  declarations: [
    PeticionPage,
  ],
  imports: [
    IonicPageModule.forChild(PeticionPage),
  ],
})
export class PeticionPageModule {}
