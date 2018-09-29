import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { HomepPage } from '../homep/homep';
import { HomecPage } from '../homec/homec';

@IonicPage()
@Component({
  selector: 'page-puntuar',
  templateUrl: 'puntuar.html',
})
export class PuntuarPage {
    viaje: String;
    location:String;
    uid_usuario: String;
    usuario: String;
    mi_uid: string;
    viaje_uid: string;
    esta_peticion
    //location:this.location,uid_usuario:this.esta_peticion.uid , viaje: this.esta_peticion.date
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afDB: AngularFireDatabase,
    private Funciones:FuncionesProvider,) {
    this.location = this.navParams.get("location");
    this.viaje = this.navParams.get("viaje");
    this.uid_usuario = this.navParams.get("uid_usuario");
    this.usuario= this.navParams.get("tipo");
    this.mi_uid = this.navParams.get("mi_uid");
    this.viaje_uid= this.navParams.get("viaje_uid");
    this.esta_peticion= this.navParams.get("esta_peticion");
    console.log(this,this.viaje);
    console.log(this,this.uid_usuario);
    console.log(this,this.usuario);

  }


  eliminar(){
    if(this.usuario == "conductores")
    {
        //this.estado = 'No existe viaje en curso';
    this.Funciones.Alert('Viaje terminado', "¿Estas seguro de terminar el viaje?", null);
    this.afDB.object(`conductores/${this.location}/historial/${this.mi_uid}/${this.viaje}/datos`).set(this.esta_peticion);
    //viaje terminado
    this.afDB.object(`pasajeros/${this.location}/peticiones/${this.viaje_uid}`).update({estado: "Viaje terminado"});

    const itemRef = this.afDB.object(`conductores/${this.location}/peticiones/${this.mi_uid}`);
    itemRef.remove().then(()=>
    {
      this.navCtrl.setRoot(HomecPage);
    });
    }
    if(this.usuario == "pasajeros"){
        this.afDB.object(`pasajeros/${this.location}/historial/${this.mi_uid}/${this.viaje}/datos`).set(this.esta_peticion);
            //this.estado = "Viaje terminado";
            const itemRef2 = this.afDB.object(`pasajeros/${this.location}/peticiones/${this.mi_uid}`);
            itemRef2.remove().then(()=>{
              this.navCtrl.setRoot(HomepPage);
            });
    }
   
  }
 puntuar(cali, comentario)
 {
   if(!comentario) comentario = "";

   if(cali)
   {
     if(this.usuario == "conductores"){
      this.afDB.object(`pasajeros/${this.location}/calificaciones/${this.uid_usuario}/${this.viaje}/`).update({'Calificacion': cali,'Comentario': comentario, 'Viaje': this.viaje   }).then(()=>{
        console.log("Enviado calif correctamente");
        this.eliminar();
      });
     }
     if(this.usuario == "pasajeros"){
      this.afDB.object(`conductores/${this.location}/calificaciones/${this.uid_usuario}/${this.viaje}/`).update({'Calificacion': cali,'Comentario': comentario, 'Viaje': this.viaje   }).then(()=>{
        console.log("Enviado correctamente");
        this.eliminar();
      });
     }
    
   }else{
    console.log("Calificación No ingresada ");
   }
 }

}
