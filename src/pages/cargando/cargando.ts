import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage'; //Importa native/storage
import { FuncionesProvider } from '../../providers/funciones/funciones';

import { InternetPage } from '../internet/internet';

@Component({
  selector: 'page-cargando',
  templateUrl: 'cargando.html',
})
export class CargandoPage {

  constructor(public navCtrl: NavController,
              private Funciones: FuncionesProvider,
) {
                this.internet_conexion();
                //this.geolocalizacion();
                //this.Cargar_location();

  }

  internet_conexion(){
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.navCtrl.setRoot(InternetPage);
      }
    })
  }



}
