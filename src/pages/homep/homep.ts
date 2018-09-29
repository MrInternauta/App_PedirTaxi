import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController  } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigPasajero } from '../../Interfaz/ubicacionpasajero';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import {InfoPerfilPage } from '../info-perfil/info-perfil';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Perfil } from '../../Interfaz/Perfil';
import {InformacionPage } from '../informacion/informacion';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { LocationPage } from '../location/location';
import { InternetPage } from '../internet/internet';
import { PeticionPage } from '../peticion/peticion';
import { UbicacionConductor } from '../../Interfaz/ubicacionconductor';
import { PuntuarPage } from '../puntuar/puntuar';

@IonicPage()
@Component({
  selector: 'page-homep',
  templateUrl: 'homep.html',
})
export class HomepPage 
{
    mi_ubicacion = {} as ConfigPasajero;
    location:string;
    peticionesref: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
    respuestaref: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
    ubicacion_conductoref: Observable<any[]>;
    ubicacion_conductor: any;
    ref: Observable<any[]>;
    perfilref: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
    c_lat:number;
    c_lng:number;
    Conductor  = {} as UbicacionConductor;
    public miperfil:any[]; //Informacion de perfil
    estado: string;
    perfiil_conductor;
    constructor(
              public navCtrl: NavController,
              public geolocation: Geolocation,
               private afAuth: AngularFireAuth,
               private afDB: AngularFireDatabase,
               private Funciones: FuncionesProvider,
               private modalCtrl: ModalController,
               private viewctrl: ViewController
  ) 
  {
    this.iniciar();
    this.internet_conexion(); //iniciar los servicios
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

  iniciar()
  {
    this.Funciones.uid().then((val)=>
    {
      if(val != null)
      {
        this.mi_ubicacion.uid = String(val); //Inicializa el uid
        console.log("1. iniciar");
        this.Cargar_location(this.mi_ubicacion.uid); //Cargar_pais
      }
    });
  }

  Cargar_location(uid:string)
  {
    this.Funciones.Cargar_Storage("location").then((val)=>
    {
      if(val != null)
      {
        this.location = String(val);
        this.location = this.location.replace('"', "");
        this.location = this.location.replace('"', "");
        console.log("2. location");
        this.verificar(uid); //erifica ubicacion o peticion
      }else
      {
        this.navCtrl.setRoot(LocationPage);
      }
    }).catch((e)=>
    {
      this.navCtrl.setRoot(LocationPage);
    })
    }

  verificar(uid:string)
  {  //Verifica si existe peticion
    this.peticionesref =  this.afDB.list(`pasajeros/${this.location}/peticiones/${uid}`).valueChanges();
      this.peticionesref.subscribe(snapshot =>
      {
        console.log("3. Verificar");
          //existe peticion
        if(snapshot[0])
        {
          if(!snapshot[1]){
            this.mi_ubicacion.date = snapshot[0].date;
            this.mi_ubicacion.O_lat  = snapshot[0].O_lat;
            this.mi_ubicacion.O_lng = snapshot[0].O_lng;
            this.mi_ubicacion.D_lat = snapshot[0].D_lat;
            this.mi_ubicacion.D_lng = snapshot[0].D_lng;
            this.mi_ubicacion.info_extra = snapshot[0].info_extra;
            this.mi_ubicacion.km = snapshot[0].km;
            this.mi_ubicacion.precio = snapshot[0].precio;
            this.mi_ubicacion.pasajeros = snapshot[0].pasajeros;
          }

          if(snapshot[1] && snapshot[1]!="Viaje terminado")
          {
            this.mi_ubicacion.date = snapshot[0].date;
            this.mi_ubicacion.O_lat  = snapshot[0].O_lat;
            this.mi_ubicacion.O_lng = snapshot[0].O_lng;
            this.mi_ubicacion.D_lat = snapshot[0].D_lat;
            this.mi_ubicacion.D_lng = snapshot[0].D_lng;
            this.mi_ubicacion.info_extra = snapshot[0].info_extra;
            this.mi_ubicacion.km = snapshot[0].km;
            this.mi_ubicacion.precio = snapshot[0].precio;
            this.mi_ubicacion.pasajeros = snapshot[0].pasajeros;
            console.log(this.mi_ubicacion); 

            this.Conductor = snapshot[1];
            if(this.Conductor)
            { 
              this.traer_usuario();
              console.log("Hay respuesta");
              //this.Funciones.Alert("Conductor encontrado", "Conductor encontrado", null);
              this.estado = "Hay respuesta";
            }
          }
          if(snapshot[1]=="Viaje terminado")
          {
            this.mi_ubicacion.date = snapshot[0].date;
            this.mi_ubicacion.O_lat  = snapshot[0].O_lat;
            this.mi_ubicacion.O_lng = snapshot[0].O_lng;
            this.mi_ubicacion.D_lat = snapshot[0].D_lat;
            this.mi_ubicacion.D_lng = snapshot[0].D_lng;
            this.mi_ubicacion.info_extra = snapshot[0].info_extra;
            this.mi_ubicacion.km = snapshot[0].km;
            this.mi_ubicacion.precio = snapshot[0].precio;
            this.mi_ubicacion.pasajeros = snapshot[0].pasajeros;
            console.log(this.mi_ubicacion);

            this.navCtrl.setRoot(PuntuarPage,{location:this.location,  viaje: this.mi_ubicacion.date, uid_usuario:this.Conductor.uid, tipo: 'pasajeros', mi_uid: this.mi_ubicacion.uid, viaje_uid:this.Conductor.uid, esta_peticion: this.mi_ubicacion});
          }
          if(!snapshot[1])
          {
            this.estado = "Hay peticion pero no hay respuesta";
            console.log("Hay peticion pero no hay respuesta");
          }
        }else
        {  
          console.log("No hay peticion");
          this.estado = "No hay peticion"
          this.traer_condutores();
          this.origen(uid);
        }
      });
  }
  
  origen(uid)
  {
    this.geolocation.getCurrentPosition().then((resp) => 
    {
      if(resp.coords.latitude  || resp.coords.longitude)
      {
          this.mi_ubicacion.O_lat = resp.coords.latitude;
          this.mi_ubicacion.O_lng = resp.coords.longitude;
      }else
      {
        this.Funciones.Alert("Alerta","¡Para detectar su ubicación debe activar el GPS!", null);
        this.Funciones.cerrar();
        this.origen(uid);
      }
    }).catch((error) => 
    {
    console.log("Dale permisos ala app");
    this.origen(uid);
    });
  }
  
  traer_condutores()
  {
    this.ubicacion_conductoref  =  this.afDB.list(`conductores/${this.location}/ubicacion/`).valueChanges();
    this.ubicacion_conductoref.subscribe(snapshot=>
      {
        if(snapshot)
        {
          this.ubicacion_conductor = snapshot;
          console.log(this.ubicacion_conductor);
        }
      })
  
  }

    //Trae informacion del pasajero
  traer_usuario()
    {
      this.respuestaref  =  this.afDB.list(`conductores/${this.location}/usuarios/${this.Conductor.uid}/`).valueChanges();
      this.respuestaref.subscribe(snapshot=>
        {
          if(snapshot)
          {
            this.perfiil_conductor = snapshot;
            console.log(this.perfiil_conductor);
          }
        })
    }

    informacion()
    {
      if(this.estado == "Hay respuesta" )
      {
        this.navCtrl.push(InformacionPage, {mi_perfil_conductor: this.perfiil_conductor, tipo: 'soy_pasajero'});
      }
    }



  //Si le dan click al mapa
  clickMap(event)
  {
    this.mi_ubicacion.D_lat = event.coords.lat;
    this.mi_ubicacion.D_lng = event.coords.lng;
    console.log(this.mi_ubicacion);
  }
  
  peticion()
  {
    this.mi_ubicacion.date = new Date().valueOf();
    if(this.mi_ubicacion.uid != null && this.mi_ubicacion.date != null && this.mi_ubicacion.O_lat != 0 && this.mi_ubicacion.O_lng != 0 && this.mi_ubicacion.D_lat != null && this.mi_ubicacion.D_lng != null )
    {
      this.mi_ubicacion.km = Number(this.calcular_distancia(this.mi_ubicacion.O_lat,this.mi_ubicacion.O_lng, this.mi_ubicacion.D_lat, this.mi_ubicacion.D_lng ));
      if(this.mi_ubicacion.km>.2)
      {
        this.calcular_precio();
        console.log(this.mi_ubicacion.precio, this.mi_ubicacion.km);
        this.navCtrl.push(PeticionPage, {ubicacion:this.mi_ubicacion, pais:this.location});
      }else
      {
        this.Funciones.Alert("Muy cerca o muy lejos", "La listancia es muy corta o muy lejana", null);
      }
  
    }else
    {
      this.Funciones.Alert("Viaje incompleto", "Selecciona tu destino", null);
      console.log("Selecciona tu ubicación");
    }
  }
  calcular_precio()
  {
    let tarifa = 11;
    //tarifa minina de 200m a 1.6km  25
    if(this.mi_ubicacion.km<=1.6)
    {
      this.mi_ubicacion.precio = 25;
    }
    if(this.mi_ubicacion.km>1.6)
    {
      this.mi_ubicacion.precio = this.mi_ubicacion.km * tarifa;
      this.mi_ubicacion.precio = Math.round(this.mi_ubicacion.precio);
    }
  
    }


  
  Cancelar_peticion()
  {
    const itemsRef = this.afDB.list(`pasajeros/${this.location}/peticiones/${this.mi_ubicacion.uid}`);
    itemsRef.remove();
    this.Funciones.Alert("Alerta!", "Peticion cancelada", null);
    this.verificar(this.mi_ubicacion.uid);
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

  info_viaje()
  {
    this.Funciones.Alert("Información del viaje", 
    "Información extra: "+this.mi_ubicacion.info_extra+"\n"
    +"Distancia: "+ this.mi_ubicacion.km + " km\n"
    +"Pasajeros: "+ this.mi_ubicacion.pasajeros + "\n"
    +"Precio $: "+ this.mi_ubicacion.precio , null);
    //console.log(this.esta_peticion);

  }


  //RADIO
  rad(x:number)
  {
    return x*Math.PI/180;
  }
  
  abrir_modal(page:number) 
  {
    let modal;
    switch(page)
    {
      case 1: modal = this.modalCtrl.create(InfoPerfilPage);
      break;
    }
    modal.present();
  }
}
