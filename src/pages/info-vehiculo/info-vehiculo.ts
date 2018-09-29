import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Platform, NavController, NavParams, ViewController } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { CargandoPage } from '../cargando/cargando';
import { LocationPage } from '../location/location';
import { InternetPage } from '../internet/internet';
import { Perfil } from '../../Interfaz/perfil';

//Modal
import { Taxi } from '../../Interfaz/Vehiculo';
// plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

// servicios
import { CargaArchivosService } from "../../providers/cargar";




@Component({
  selector: 'page-info-vehiculo',
  templateUrl: 'info-vehiculo.html',
})
export class InfoVehiculoPage {

    user = {} as Taxi;
    location:string;
    uid:string;
    imgPreview:string = null;
    img:string = "";
    url:string;
    mi_perfil_conductor = {} as Perfil;
  constructor(private afAuth: AngularFireAuth,
              private afDB: AngularFireDatabase,
              private platform: Platform,
              private Funciones: FuncionesProvider,
              private _cas: CargaArchivosService,
              private camera: Camera,
              private imagePicker: ImagePicker,
              private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController


) {
  this.internet_conexion();
  this.mi_perfil_conductor = this.navParams.get("mi_perfil_conductor");
  console.log(this.mi_perfil_conductor);
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

  taxi_info(user:Taxi){
    //Verifica si esta en telefono o web

    if(!this.platform.is("cordova")){//si esta en web se asigna un link a la foto
      this.user.Foto = "http://www.versiones.com.mx/wp-content/uploads/2015/09/771a0image_1125.jpg";
    }
    else{
      if(this.mi_perfil_conductor.Foto){
      this.user.Foto = this.mi_perfil_conductor.Foto;
      }else{
        this.user.Foto = this.url;
      }
    }

    if(user.Num_taxi>0 && user.Placas != null && user.Descripcion != null //&& user.Foto != null
    )
    {
      this.afAuth.authState.subscribe( auth => {
        this.afDB.object(`conductores/${this.location}/usuarios/${auth.uid}/vehiculo`).update(this.user)
        .then(()=>{
          console.log("Informacion del taxi guardada");
          this.Funciones.loader.dismiss();
          this.Funciones.Alert("Guardado","Informacion del vehiculo guardada", null);
          if(this.mi_perfil_conductor){
            this.viewCtrl.dismiss();
          }else{
            //this.viewCtrl.dismiss();
            location.reload();
            //this.navCtrl.setRoot(CargandoPage);
          }
        });
      });
    }
    else {
      this.Funciones.loader.dismiss();
      this.Funciones.Alert("Alerta","Informacion incompleta, faltan datos.", null)
    }
  }
  Cargar_location(){
    this.Funciones.Cargar_Storage("location").then((val)=>{
      if(val== null){ this.navCtrl.setRoot(LocationPage)}else{
          this.location = String(val);
          this.location = this.location.replace('"', "");
          this.location = this.location.replace('"', "");
          console.log(this.location);
      }
    }).catch((e)=>{
      this.Cargar_location();
    })
  }



    crear_post(){
      console.log("Subiendo imagen...");

      let archivo = {
        'img': this.img
      };
      this.Funciones.presentLoading("Subiendo imagen...")

      this._cas.cargar_imagenes_firebase( archivo )
            .then(
              (url)=>{
                this.url = String(url);
                this.Funciones.loader.dismiss();
              },

              ( error )=>{
                this.Funciones.loader.dismiss();
                this.Funciones.mostar_toast("Error al cargar: " + error );
                console.log("Error al cargar " + JSON.stringify(error) );
              }

             )


    }



    mostrar_camara(){

      if( !this.platform.is("cordova") ){
        this.Funciones.mostar_toast("Error: No estamos en un celular");
        return;
      }


      const options: CameraOptions = {
          quality: 30,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true
      }

      this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         this.imgPreview = 'data:image/jpeg;base64,' + imageData;
         this.img = imageData;
         this.crear_post()

        }, (err) => {
         // Handle error
         this.Funciones.mostar_toast( "Error: " + err );
         console.error("Error en la camara: ", err);

      });


    }

    seleccionar_fotos(){

      if( !this.platform.is("cordova") ){
        this.Funciones.mostar_toast("Error: No estamos en un celular");
        return;
      }

      let opciones: ImagePickerOptions = {
        maximumImagesCount: 1,
        quality: 30,
        outputType: 1
      }


      this.imagePicker.getPictures(opciones).then((results) => {
        for(let img  of results ){

          this.imgPreview = 'data:image/jpeg;base64,' + img;
          this.img = img;
          break;

        }
        if(this.img){
          this.crear_post();

        }

      }, (err) => {

        this.Funciones.mostar_toast("Error seleccion:" + err);
        console.error(  "Error en seleccion: " + JSON.stringify( err ) );

      });

    }



}
