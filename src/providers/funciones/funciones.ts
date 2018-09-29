import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform,AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import {InfoPerfilPage } from '../../pages/info-perfil/info-perfil';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Network } from '@ionic-native/network';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

import 'rxjs/add/operator/map';

@Injectable()
export class FuncionesProvider {
    public loader:any;
    pais: string;
    ref: Observable<any[]>;
    location:string;
    usuario:string;
    conductores: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
    pasajeros: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
    perfilref: Observable<any[]>;
    constructor(
      public platform: Platform,
      public alertCtrl: AlertController,
      private modalCtrl: ModalController,
      private toastCtrl: ToastController,
      private loadingCtrl: LoadingController,
      private storage: Storage,
      private geolocation: Geolocation,
      private afAuth: AngularFireAuth,
      private afDB: AngularFireDatabase,
      private network: Network,
      private backgroundGeolocation: BackgroundGeolocation




    ){

    }
   mostar_toast( texto:string )
  {
    this.toastCtrl.create({
      message:texto,
      duration: 2500
    }).present();
  }

  cerrar(){
    if(this.platform.is("cordova"))

    {
      this.platform.exitApp();
    }else{
      location.reload();
    }
  }


   presentLoading(txt:string)
   {
      this.loader = this.loadingCtrl.create
      ({
      content: txt,
      });
      this.loader.present();
   }

   Alert(titulo: string, txt: string, funcion: any)
   {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: txt,
      buttons: [
         {
           text: 'Aceptar',
           handler: data => {
             if(funcion != null){
               funcion();
             }

           }
         }

       ]
    });
    alert.present();
   }

   Cargar_Storage(txt){ //verifica si esta en el telefono
     let promesa = new Promise( (resolve, reject)=>
       {
     if(this.platform.is("cordova")){
       this.storage.ready()
                   .then(()=>{
                       //TRAE la informacion pais
                 this.storage.get(txt).then((val) => {
                         resolve(val);
                 }).catch((e)=>{
                   resolve(null);
                    //this.abrir_modal(3);
                       })
                     });
     }
     else{//o en web
         if(localStorage.getItem(txt) ){
              let value = localStorage.getItem(txt);
              resolve(value);

         }
         else{
           resolve(null);
           //this.abrir_modal(3);
         }
       }
     });
     return promesa;
   }

   //SALIR CERRAR SESSION
   signOut() {
     this.afAuth.auth.signOut();
     this.cerrar();

     }

     uid(){
       let promesa = new Promise( (resolve, reject)=>{
         this.afAuth.authState.subscribe(user => {
           if(user){
             resolve(user.uid)
            }
            else{
              resolve(null)
         }
          })
      })
      return promesa;
     }


     obtener_data_firebase(direccion:string){
       let promesa = new Promise( (resolve, reject)=>{
         this.ref = this.afDB.list(`${direccion}`).valueChanges();
         this.ref.subscribe(snapshot =>
         {
           if(snapshot[0]){
             resolve(snapshot);
           }else{
             resolve(null);
           }
         });
      });
      return promesa;
    }

    Guardar_Storage(txt, val){
          let promesa = new Promise( (resolve, reject)=>
            {
        if(this.platform.is("cordova")){
          this.storage.ready()
                      .then(()=>{
                        this.storage.set(txt, val)
                        resolve(true);
                      }).catch((e)=>{
                        this.Guardar_Storage(txt, val);
                      });
        }
        else{
          localStorage.setItem(txt, JSON.stringify(val));
          resolve(true);
        }
      });
      return promesa;
  }



  Localizar(){
      let promesa = new Promise( (resolve, reject)=>{
          this.geolocation.getCurrentPosition().then((resp) => {
            resolve(resp)
      }).catch((error) => {
        resolve(false);
      });
    });
    return promesa;
  }

  //Carga la localidad
  Cargar_location(){
    let promesa = new Promise( (resolve, reject)=>{
    this.Cargar_Storage("location").then((val)=>{
      if(val== null){
        resolve('location')
      }else{
        this.location = String(val);
        this.location = this.location.replace('"', "");
        this.location = this.location.replace('"', "");
        console.log(this.location);
      }
    }).catch((e)=>{
      this.Cargar_location();
    })
  })
  return promesa;
  }

  //Carga la localidad
  Cargar_tipo(uid: string){
  let promesa = new Promise( (resolve, reject)=>{
      this.Cargar_Storage(uid+"/tipo").then((val)=>{
        if( val != null){
          let usuario = String(val);
          usuario = usuario.replace('"', "");
          usuario = usuario.replace('"', "");
          resolve(usuario);
        }else{
          resolve(null);
        }
      }).catch((e)=>{
        console.log("Error al cargar el tipo de usuario");
        this.Cargar_tipo(uid);
      });
  });
  return promesa;

  }
  internet_conexion(){
    let promesa = new Promise( (resolve, reject)=>{
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        resolve('desconectado')
      });

        });
        return promesa;
  }

    geolocation_background(){
          let promesa  = new Promise((resolve, reject)=>{
            if(this.platform.is("cordova")){
              const config: BackgroundGeolocationConfig = {
                    desiredAccuracy: 10,
                    stationaryRadius: 20,
                    distanceFilter: 30,
                    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
                    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
            };

        this.backgroundGeolocation.configure(config)
          .subscribe((location: BackgroundGeolocationResponse) => {
            console.log(location);

            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            this.backgroundGeolocation.finish(); // FOR IOS ONLY

          });

        // start recording location
        this.backgroundGeolocation.start();

        // If you wish to turn OFF background-tracking, call the #stop method.
        this.backgroundGeolocation.stop();
      }else{
        console.log("No esta en Telefono")
      }
    });
    return promesa;

    }



}
