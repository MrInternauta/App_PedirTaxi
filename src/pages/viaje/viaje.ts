import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-viaje',
  templateUrl: 'viaje.html',
})
export class ViajePage {
  tipo
  viaje
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.viaje = this.navParams.get("viaje");
    console.log(this.viaje)
  }


}









