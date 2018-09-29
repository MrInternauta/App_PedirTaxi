import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViajePage } from '../viaje/viaje';

/**
 * Generated class for the ViajesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viajes',
  templateUrl: 'viajes.html',
})
export class ViajesPage {
  tipo: string;
  viajes: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
    this.tipo = this.navParams.get("tipo");
    this.viajes = this.navParams.get("viajes");
    console.log(this.tipo);
     console.log(this.viajes)
    }
  ver(viaje){
    this.navCtrl.push(ViajePage, {viaje: viaje});
  }



}
