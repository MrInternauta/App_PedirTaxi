import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InfoPerfilPage } from '../info-perfil/info-perfil';
import { InfoVehiculoPage } from '../info-vehiculo/info-vehiculo';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { InternetPage } from '../internet/internet';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
    usuario:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private Funciones:FuncionesProvider) {
                this.internet_conexion();
                this.Cargar_tipo();

  }
  internet_conexion(){
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.navCtrl.setRoot(InternetPage);
      }
    })
  }

  Mover(x:number){
    if(x== 1){
      this.navCtrl.push(InfoPerfilPage);
    }
    if(x== 2){
      this.navCtrl.push(InfoVehiculoPage);
    }
  }
  Cargar_tipo(){
    this.Funciones.presentLoading("Esperar");
    this.Funciones.uid().then((val)=>{
      if(val != null){
        let uid = String(val);
        this.Funciones.Cargar_Storage(uid+"/tipo").then((val)=>{
          if( val != null){
            this.usuario = String(val);
            this.usuario = this.usuario.replace('"', "");
            this.usuario = this.usuario.replace('"', "");
            this.usuario = this.usuario;
            console.log(this.usuario);
          }

        }).catch((e)=>{
          console.log("Error al cargar el tipo de usuario")
        });
      }
    })
    this.Funciones.loader.dismiss();
  }


}
