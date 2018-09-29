import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { CargandoPage } from '../cargando/cargando';

/**
 * Generated class for the InternetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-internet',
  templateUrl: 'internet.html',
})
export class InternetPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private Funciones: FuncionesProvider,
) {
  }
  internet_conexion(){
    this.navCtrl.setRoot(CargandoPage);
  }



}
