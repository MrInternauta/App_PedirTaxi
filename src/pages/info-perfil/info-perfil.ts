import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Platform, NavController, NavParams, ViewController } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { CargandoPage } from '../cargando/cargando';
import { LocationPage } from '../location/location';
import { InternetPage } from '../internet/internet';

//Modal
import { Perfil } from '../../Interfaz/perfil';
// plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

// servicios
import { CargaArchivosService } from "../../providers/cargar";

@Component({
  selector: 'page-info-perfil',
  templateUrl: 'info-perfil.html',
})
export class InfoPerfilPage {
    location:string;
    uid:string;
    imgPreview:string = null;
    img:string = "";
    url:string;
    perfil=  {} as Perfil;
    usuario:string;
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
            )
              {
               this.internet_conexion();
               this.mi_perfil_conductor = this.navParams.get("mi_perfil_conductor");
               console.log(this.mi_perfil_conductor)
               this.iniciar();

              }
              internet_conexion(){
                this.Funciones.internet_conexion().then((val)=>{
                  let inter = String(val);
                  if(inter == 'desconectado'){
                    this.navCtrl.setRoot(InternetPage);
                  }
                })
              }

  personal_info(Name,Lastname,Telefono) //Informacion de perfil: Nombres, Apellidos, Foto, Telefono, Nacimiento
  {

          if(!this.platform.is("cordova")){//si esta en web se asigna un link a la foto
            this.perfil.Foto = "http://www.coordinadora.com/wp-content/uploads/sidebar_usuario-corporativo.png";
          }
          else{
            if(this.mi_perfil_conductor.Foto){
            this.perfil.Foto = this.mi_perfil_conductor.Foto;
            }else{
              this.perfil.Foto = this.url;
            }
          }
      //Verifica si esta en telefono o web
      this.Funciones.presentLoading("Registrando información");
      console.log(Telefono, Name, Lastname, this.perfil.Foto);
      //Verfica si la Informacion es completa
    if( Telefono.length >6 && this.perfil.Foto  && Name.length > 2 && Lastname.length>2){
          this.perfil.Phone = String(Telefono);
          this.perfil.Name = Name;
          this.perfil.Lastname = Lastname;
        this.afAuth.authState.subscribe( auth => {
          this.Cargar(auth.uid+"/tipo");
          //Sube la informacion a firebase
          this.Funciones.loader.dismiss();
          this.afDB.object(`${this.usuario}/${this.location}/usuarios/${this.uid}/perfil/`).update(this.perfil)
          .then(()=>{
            //Si todo esta bien
            console.log("Informacion peronal guardada");  //Console, Para programador
            this.Funciones.Alert("Guadado", "Perfil guadado correctamente", null);

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
    //Si la Informacion de perfil no es completa
    else {
    this.Funciones.loader.dismiss();
      this.Funciones.mostar_toast("Informacion incompleta, faltan datos.")
    }
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


  //Carga la localidad
  Cargar(titulo){
    this.Funciones.Cargar_Storage(titulo).then((val)=>{
      if(val== null){

      }else{
        if(titulo == "location"){
          this.location = String(val);
          this.location = this.location.replace('"', "");
          this.location = this.location.replace('"', "");
          console.log(this.location);

        }
        else{
          this.uid = String(val);
        }

      }
    }).catch((e)=>{
      this.Cargar(titulo);
    })
  }

  iniciar()
  { this.Funciones.presentLoading("Espere");
  this.Cargar("location");
    this.Funciones.uid().then((val)=>{
      if(val != null ){
        this.uid = String(val);
        console.log(this.uid);
        this.Cargar_tipo(this.uid+"/tipo");
      }else{
        console.log("No hay datos en el storage")
      }
    });
     this.Funciones.loader.dismiss();
  }

  //Carga la localidad
  Cargar_tipo(txt){
    this.Funciones.Cargar_Storage(txt).then((val)=>{
      this.usuario = String(val);
      this.usuario = this.usuario.replace('"', "");
      this.usuario = this.usuario.replace('"', "");
      this.usuario = this.usuario;
      console.log(this.usuario);
    }).catch((e)=>{
      this.Cargar_tipo(txt);
    })
  }
}
