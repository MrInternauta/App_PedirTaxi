import { Component } from '@angular/core';
import {  ViewController,NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Platform } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { InfoPerfilPage } from '../info-perfil/info-perfil';
import { InternetPage } from '../internet/internet';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  location:string="";
  constructor(
    private viewCrl: ViewController,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private Funciones: FuncionesProvider,
    private navCtrl: NavController


) {
  this.internet_conexion();
  this.Cargar_location();
  }
  internet_conexion(){
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.navCtrl.setRoot(InternetPage);
      }
    })
  }

  inicio(){
    this.viewCrl.dismiss();
  }
  async register(Email:string, Password: string, Password2: string, usuario:string){
      this.Funciones.presentLoading("Registrando usuario");
    if(Password == Password2 && Email != null && usuario != null){
      try{
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(Email,Password);
        let titulo = result.uid +"/tipo";  //ajhsdhjasdjhjsdhsa/tipo -- sjdjhjkskjhshjdajh/tipo
        this.Guardar_tipo(titulo,usuario);
        this.crear_perfil(Email, Password, usuario);
      }
      catch(e){
        console.error(e);
        this.Funciones.Alert("Error","Error al registrarte "+ e.message, null);
        this.Funciones.loader.dismiss();
      }
    }
    else{
      this.Funciones.Alert("Error","Error al registrarte faltan datos ó las contraseñas no son iguales.", null);
      this.Funciones.loader.dismiss();
    }
  }

  crear_perfil(Email:string, Password: string, usuario:string){
    this.afAuth.authState.subscribe( auth => {
      this.afDB.object(`${usuario}/${this.location}/usuarios/${auth.uid}/perfil_privado/`).set({Email: Email, Password: Password})
      .then(()=> {
                  this.Funciones.loader.dismiss();
                  this.navCtrl.setRoot(InfoPerfilPage);
       });
    });
  }

  //Carga la localidad
  Cargar_location(){
  this.Funciones.presentLoading("Espere");
    this.Funciones.Cargar_Storage("location").then((val)=>{
      if(val != null){
        this.location = String(val);
        this.location = this.location.replace('"', "");
        this.location = this.location.replace('"', "");
        console.log(this.location)
        this.Funciones.loader.dismiss();
      }
    }).catch((e)=>{
      this.Cargar_location();
    })
  }

  Guardar_tipo(titulo, tipo){
    this.Funciones.Guardar_Storage(titulo,tipo).then(()=>{

    }).catch(()=>{
      this.Guardar_tipo(titulo, tipo);
    })
  }

}
