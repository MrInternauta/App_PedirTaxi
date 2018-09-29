import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigPasajero } from '../../Interfaz/ubicacionpasajero';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import {MyApp } from '../../app/app.component';
import { Perfil } from '../../Interfaz/perfil';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { InternetPage } from '../internet/internet';

@IonicPage()
@Component({
  selector: 'page-peticion',
  templateUrl: 'peticion.html',
})
export class PeticionPage {
  loader:any;
  mi_ubicacion = {} as ConfigPasajero;
  pais:string
  miperfil:Perfil; //Informacion de perfil

  slides = [
    {
      title: "¡Configura tu viaje!",
      description: "Es necesario configurar otros aspectos del viaje...",
      image: "assets/img/icon/ico.png",
    }
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public geolocation: Geolocation,
              private afDB: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private viewctrl: ViewController,
              private Funciones: FuncionesProvider
) {
  this.mi_ubicacion = this.navParams.get('ubicacion');
  this.pais = this.navParams.get("pais");
  this.internet_conexion();
  }

  internet_conexion(){
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.navCtrl.setRoot(InternetPage);
      }
    })
  }
  continuar(datos:ConfigPasajero){
    if(datos.pasajeros != null  && datos.info_extra){
        this.crear_peticion();
        //enviar datos
    }else{
      console.log("Informacion incompleta");
      this.Funciones.Alert("Informacion incompleta", "Alerta",null);
    }

  }

  crear_peticion(){
    this.afAuth.authState.subscribe( auth => {
      this.mi_ubicacion.estado = "Peticion"
      this.afDB.object(`pasajeros/${this.pais}/peticiones/${auth.uid}/datos`).set(this.mi_ubicacion)
      .then(()=> {
        this.viewctrl.dismiss();
        this.Funciones.Alert("Informacion enviada", "Peticion enviada", null);
       });
    });
  }
  cancelar (){
    this.viewctrl.dismiss();
  }
}
