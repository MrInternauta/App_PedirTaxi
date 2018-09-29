import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { SignupPage } from '../signup/signup';
import { CargandoPage } from '../cargando/cargando';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { InternetPage } from '../internet/internet';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private Funciones: FuncionesProvider,
              private afAuth: AngularFireAuth,) {
                //this.internet_conexion();
  }
  internet_conexion(){
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.navCtrl.setRoot(InternetPage);
      }
    })
  }
  async Iniciar_session(user:string, pass:string){
    if(user && pass){
      this.Funciones.presentLoading("Iniciando sesión");
                        try{//si todo salio bien incii sesion
                          const result = await this.afAuth.auth.signInWithEmailAndPassword(user,pass);
                          this.Funciones.loader.dismiss();
                              this.navCtrl.setRoot(CargandoPage);
                              }
            catch(e){
              console.error(e);
              this.Funciones.loader.dismiss();
              this.Funciones.Alert("Alerta", "Error al iniciar sesión: "+ e.message, null);
            }
    }else{
      this.Funciones.Alert("Alerta", "Faltan datos", null);
    }
  }

  Mov_Pag(){
    this.navCtrl.push(SignupPage);
  }
}
