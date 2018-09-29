import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import * as firebase from "firebase";


@Injectable()
export class CargaArchivosService {

  private CARPETA_IMAGENES:string = "img";

  imagenes:any[] = [];
  lastKey:string = undefined;
  uid:string;
  constructor( public af: AngularFireModule,
               private toastCtrl: ToastController,
               private afAuth: AngularFireAuth,
) {}



  cargar_imagenes_firebase( archivo:archivoSubir ){


    let promesa = new Promise( (resolve, reject)=>{

      this.mostar_toast("Inicio de carga");

      let storageRef = firebase.storage().ref();
      this.ouid()
      let nombreArchivo = this.uid;

      let uploadTask:firebase.storage.UploadTask =
              storageRef.child(`${ this.CARPETA_IMAGENES  }/${ nombreArchivo }`)
              .putString( archivo.img, 'base64', { contentType: 'image/jpeg' }  );


      uploadTask.on(  firebase.storage.TaskEvent.STATE_CHANGED,
          ( snapshot )=>{}, // saber el avance del archivo
          ( error )=> {  // Manejo de errores

            console.log("Error al subir ", JSON.stringify( error ));
            this.mostar_toast("Error al cargar: " + JSON.stringify( error ) );
            reject(error);

          },
          ()=>{ // Termino el proceso

            let url = uploadTask.snapshot.downloadURL;
            this.mostar_toast("Imagen cargada exitosamente!!");
            resolve(url);

          }
        )
    });
    return promesa;
  }






  private mostar_toast( texto:string ){
    this.toastCtrl.create({
      message:texto,
      duration: 2500
    }).present();
  }

  ouid(){
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.uid = user.uid;
       }

     })
  }




}



interface archivoSubir{
  $key?:string;
  img:string;
}
