import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { InternetPage } from '../internet/internet';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { InfoPerfilPage } from '../info-perfil/info-perfil';
import { InfoVehiculoPage } from '../info-vehiculo/info-vehiculo';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-informacion',
  templateUrl: 'informacion.html',
})
export class InformacionPage {
  Conductor: any[];
  Pasajero: any[];
  mi_perfil_conductor: any[];
  mi_perfil_pasajero: any[];
  tipo: string;
  numero:string="";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private Funciones: FuncionesProvider,
              private callNumber: CallNumber, public AlertCtrl:AlertController
) {
    this.tipo = this.navParams.get("tipo");
    this.Conductor = this.navParams.get("informacion");
    this.Pasajero = this.navParams.get("pasajero");
    this.mi_perfil_conductor = this.navParams.get("mi_perfil_conductor");
    this.mi_perfil_pasajero = this.navParams.get("mi_perfil_pasajero");
    this.internet_conexion();
  }
  internet_conexion()
  {
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.navCtrl.setRoot(InternetPage);
      }
    })
  }
  mover(x:number)
  {
    if(x== 1){
      this.navCtrl.push(InfoPerfilPage, {mi_perfil_conductor:this.mi_perfil_conductor[0]});
    }
    if(x== 2){
      this.navCtrl.push(InfoVehiculoPage, {mi_perfil_conductor:this.mi_perfil_conductor[2]});
    }
    if(x== 3){
      this.navCtrl.push(InfoPerfilPage, {mi_perfil_conductor:this.mi_perfil_pasajero[0]});
    }
  }

  llamar(){
    if(this.tipo == "soy_conductor")
    {
      this.numero = this.mi_perfil_pasajero[0].Phone
    }
    if(this.tipo == "soy_pasajero")
    {
      this.numero = this.mi_perfil_conductor[0].Phone

    }
    //mi_perfil_pasajero[0].Foto
    //mi_perfil_conductor[0].calificacion
    this.callNumber.callNumber(this.numero, true)
    .then(() => console.log('Marcador abierto!'))
    .catch(() => console.log('Error al abrir marcador'));
  }




}
