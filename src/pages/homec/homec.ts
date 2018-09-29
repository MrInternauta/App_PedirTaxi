import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { InternetPage } from '../internet/internet';
import { PeticionPage } from '../peticion/peticion';
import { AngularFireDatabase } from 'angularfire2/database';
import { ConfigPasajero } from '../../Interfaz/ubicacionpasajero';
import { Observable } from 'rxjs/Observable';
import { LocationPage } from '../location/location';
import { UbicacionConductor } from '../../Interfaz/ubicacionconductor';
import { Geolocation } from '@ionic-native/geolocation';
import { Perfil } from '../../Interfaz/Perfil';
import {InformacionPage } from '../informacion/informacion';
import { CargandoPage } from '../cargando/cargando';
import { PuntuarPage } from '../puntuar/puntuar';
//                "GOOGLE_PLAY_SERVICES_VERSION": "11.0.1",

@IonicPage()
@Component({
  selector: 'page-homec',
  templateUrl: 'homec.html',
})
export class HomecPage 
{
  location:string;
  peticionesref:Observable<any[]>;
  disponible: boolean = false;
  esta_peticion: any;
  watch:any;
  mi_ubicacion = {} as UbicacionConductor;
  estado:string;
  perfilref: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
  public miperfil:Perfil[]; //Informacion de perfil
  buscar_v:boolean;
  mi_ubicacion_conductor = {} as UbicacionConductor;
  pasajerosref: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
  pasajeros:any;
  ref: Observable<any[]>;
  km:number;
  km2:number;
  constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private afDB: AngularFireDatabase,
                private Funciones:FuncionesProvider,
                public geolocation: Geolocation
              ) 
    {
      this.internet_conexion(); //Si no hay internet te manda a otra pagina
      this.iniciar(); //Inicia la aplicacion
    }

    //SI NO HAY INTERNET NO TE PERMITE CONTINUAR
    internet_conexion()
    {
      this.Funciones.internet_conexion().then((val)=>
      {
        let inter = String(val);
        if(inter == 'desconectado')
        {
          this.navCtrl.setRoot(InternetPage);
        }
      });
    }

    iniciar() //Inicia servicios
    {
      this.Funciones.uid().then((val)=>{
      if(val != null)
      {
        console.log("iniciar");
        this.mi_ubicacion.uid = String(val) //Da valor a uid
        this.Cargar_location(this.mi_ubicacion.uid); //Cargar_pais
      }
      });
    }

    //carga la localizacion (pais/estado/municipio)
    Cargar_location(uid:string)
    {
      this.Funciones.Cargar_Storage("location").then((val)=>
      {
        if(val != null)
        {
          this.location = String(val);
          this.location = this.location.replace('"', "");
          this.location = this.location.replace('"', "");
          console.log("2location");
          this.verifica_peticiones();
        }else
        {
          this.navCtrl.setRoot(LocationPage);
        }
      }).catch((e)=>
      {
        this.navCtrl.setRoot(LocationPage);
      })
    }

  //VERIFICA SI YA TIENE PETICION O VIAJE ASIGNADO
    verifica_peticiones()
    {
      this.Funciones.obtener_data_firebase(`conductores/${this.location}/peticiones/${this.mi_ubicacion.uid}/`).then((val)=>
      {
      if(val != null)
      {
        if(val)
        {
          this.estado = "Existe viaje en curso";
          console.log("Existe viaje en curso");
          this.esta_peticion = val[0];
          this.traer_usuario();
          console.log(this.esta_peticion);
          this.posision();

        }
      }else
      {
        //NO EXISTE PETICION O VIAJE EN CURSO
        console.log("No existe viaje en curso");
        this.estado = 'No existe viaje en curso';
        this.posision();


        
      }
      }).catch(()=>
      {
        this.verifica_peticiones();
      });

  }

  //Trae informacion del pasajero
  traer_usuario()
  {
    this.pasajerosref  =  this.afDB.list(`pasajeros/${this.location}/usuarios/${this.esta_peticion.uid}/`).valueChanges();
    this.pasajerosref.subscribe(snapshot=>
      {
        if(snapshot)
        {
          this.pasajeros = snapshot;
          console.log(this.pasajeros);
        }
      })
  }


  //DETERMINA SU posision EN TIEMPO REAL
  posision()
  {
    this.watch = this.geolocation.watchPosition();
    this.watch.subscribe((data) =>
    {
      this.mi_ubicacion.lat = data.coords.latitude;
      this.mi_ubicacion.lng = data.coords.longitude;
      this.enviar_ubi();
    });
  }

  enviar_ubi()
  {
    if(this.estado == "No existe viaje en curso")
    {
      this.afDB.object(`conductores/${this.location}/ubicacion/${this.mi_ubicacion.uid}`).update(this.mi_ubicacion).then(()=> 
      {
      //si todo salio bien
      this.buscar();
      console.log("ubicacion Enviado exitosamente"); 
      });
    }
    if(this.estado == 'Existe viaje en curso')
    {
      this.afDB.object(`pasajeros/${this.location}/peticiones/${this.esta_peticion.uid}/ubicacion`).update(this.mi_ubicacion);
      console.log("ubicacion Enviado exitosamente"); 
    }
  }

  //VERIFICA SI HAY usuarios
  buscar()
  {
    this.ref =  this.afDB.list(`pasajeros/${this.location}/peticiones`).valueChanges()
    this.ref.subscribe(snapshot=>
    {
      this.seleccionar(snapshot);
    })
  }

  //FUNCION: SELECCIONA LA PETICION LE PASA LA CAPTURAS (snapshots)
  seleccionar(snapshot)
  {
    //verifica la ubicacion del condutor esta llena
    if (this.mi_ubicacion.lat != null && this.mi_ubicacion.lng !=null)
    {
      //Recorre un array con LA CAPTURAS (snapshots) de las peticiones
      for (let i = 0; i < snapshot.length; i++) 
      {
        //MANDA A LLAMAR FUNCION PARA CALCULA LA DISTANCIA DE PASAJERO Y CONDUCTOR EN KM
        //KM GUARDA LA DISTANCIA ENTRE EL PASAJERO Y EL CONDUCTOR
        if(!snapshot[i].estado){
          this.km = Number(this.calcular_distancia(this.mi_ubicacion.lat,this.mi_ubicacion.lng, Number(snapshot[i].datos.O_lat), Number(snapshot[i].datos.O_lng) ));
        }
        if (!this.km2) 
        { //VERIFICA SI ES LA PRIMERA COMPARACION
                        this.esta_peticion = snapshot[i]; //LA CAPTURA[I] LA GUARDA UNA VARIABLE
                        this.km2= this.km; //RESPALDA EL VALOR DE KM EN KM2
        }else
        { // SI NO ES LA PRIMERA COMPARACION
          if (this.km<this.km2) 
          {
            this.km2= this.km; //RESPALDA EL VALOR DE KM EN KM2
            this.esta_peticion = snapshot[i]; //LA CAPTURA[I] LA GUARDA UNA VARIABLE
          }
        }
      }
      if(Number(this.km2)>0 && Number(this.km2)<=35)
      {
        console.log("Pasajero a "+ this.km2+" KM aprox."); //CONSOLE LOG CON LA Informacion
        this.Funciones.Alert('¡Pasajero encontrado!', "Aproximadamente " + this.km2 + 'KM', null);
        //enviar a firebase - llamar funcion verifica_peticiones
        this.afDB.object(`conductores/${this.location}/peticiones/${this.mi_ubicacion.uid}`).update(this.esta_peticion).then(()=> 
        {
          //si todo salio bien
          console.log("Enviado exitosamente");
          //envio mi lat, lng y uid
          this.afDB.object(`pasajeros/${this.location}/peticiones/${this.esta_peticion.datos.uid}/ubicacion`).update(this.mi_ubicacion).then(()=>
          {
            //borrar mi ubicacion
            const itemRef = this.afDB.object(`conductores/${this.location}/ubicacion/${this.mi_ubicacion.uid}`);
            itemRef.remove().then(()=>{
              this.navCtrl.setRoot(HomecPage);
            });
          }); 


        });
      }
      if(Number(this.km2)>35)
      {
        this.Funciones.Alert('¡Hay pasajeros lejos!', "Aproximadamente " + this.km2 + 'KM', null);
        this.cancelar();

      }
      if(Number(this.km2)<0)
      {
        this.Funciones.Alert('¡No hay pasajeros disponibles!', "No se pudo encontrar pasajeros", null);
        this.cancelar();
      }

    }
  }

  //CALCULA LA DISTANCIA KM DE PUNTO A PUNTO APARTIR DE (LAT, LONG) Origen y (LAT, LONG) destino
  calcular_distancia(lat1: number, lon1: number, lat2: number, lon2: number)
  {
    let R     = 6378.137; //Radio de la tierra en km
    let dLat  = this.rad( lat2 - lat1 );
    let dLong = this.rad( lon2 - lon1 );
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    d = d*1.5 //distancia aumentando la mitad
    return d.toFixed(3); //Retorna tres decimales
  }

  //RADIO
  rad(x:number)
  {
    return x*Math.PI/180;
  }

  //(PUSH) MUESTRA LA PAGINA DE LA INFORMACION DEL PASAJERO
  info_pasaje()
  {
    this.navCtrl.push(PeticionPage,{ 'esta_peticion':this.esta_peticion });
  }

  //CANCELA EL VIAJE E RESETEA LOS DATOS
  cancelar()
  {
    this.esta_peticion = null; //LA VARIABLE DONDE ALMACENA LA Peticion ELEGIDA SE RESETEA
    this.km = 0; //VARIABE RESETEADA (DISTANCIA ENTRE EL PASAJEROY CONDUCTOR)
    this.km2 = 0; //VARIABE RESETEADA (DISTANCIA ENTRE EL PASAJEROY CONDUCTOR) AUXILIAR
  }

  //PUSH PA VENTAJADE PASAJERO
  informacion()
  {
    if(this.estado == "Existe viaje en curso" || this.estado == 'No existe viaje en curso' )
    {
      this.navCtrl.push(InformacionPage, {mi_perfil_pasajero: this.pasajeros, tipo: 'soy_conductor'});
    }
  }
  info_viaje()
  {
    this.Funciones.Alert("Información del viaje", 
    "Información extra: "+this.esta_peticion.info_extra+"\n"
    +"Distancia: "+ this.esta_peticion.km + " km\n"
    +"Pasajeros: "+ this.esta_peticion.pasajeros + "\n"
    +"Precio $: "+ this.esta_peticion.precio , null);
    //console.log(this.esta_peticion);

  }

  viaje_terminado(){
    this.navCtrl.setRoot(PuntuarPage,{location:this.location,uid_usuario:this.esta_peticion.uid , viaje: this.esta_peticion.date, tipo: 'conductores',mi_uid: this.mi_ubicacion.uid, viaje_uid:this.esta_peticion.uid, esta_peticion: this.esta_peticion});
  }
}