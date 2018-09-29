import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CargandoPage } from '../pages/cargando/cargando';
import { InternetPage } from '../pages/internet/internet';
//import { TabsPage } from '../pages/tabs/tabs';
import { InfoPerfilPage } from '../pages/info-perfil/info-perfil';
import { InformacionPage } from '../pages/informacion/informacion';
import { FuncionesProvider } from '../providers/funciones/funciones';
import { HomecPage } from '../pages/homec/homec';
import { HomepPage } from '../pages/homep/homep';
import { ViajesPage } from '../pages/viajes/viajes';
import { PuntuarPage } from '../pages/puntuar/puntuar';
import { EmergenciaPage } from '../pages/emergencia/emergencia';
import { LocationPage } from '../pages/location/location';
import { LoginPage } from '../pages/login/login';
import { InfoVehiculoPage } from '../pages/info-vehiculo/info-vehiculo';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = CargandoPage;
  pages: Array<{title: string, component: any, icon: string}>; //paginas del menu
  uid:string;
  usuario:string;
  location:string;
  conductores: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
  pasajeros: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
  perfilref: Observable<any[]>; //REFERCIA PARA TRAER PETCIONES DE PASAJEROS
  public perfil:any; //Informacion de perfil
  miperfil: any;
  ref: Observable<any[]>;
  viaje: any[];

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private Funciones: FuncionesProvider,
              private afAuth: AngularFireAuth,
              private afDB: AngularFireDatabase,)
  {
    this.internet_conexion();
   this.Cargar_location();
    this.initializeApp();
  }

  internet_conexion(){
    this.Funciones.internet_conexion().then((val)=>{
      let inter = String(val);
      if(inter == 'desconectado'){
        this.rootPage = InternetPage;
      }
    })
  }

  //Carga la localidad
  Cargar_location(){
    this.Funciones.Cargar_Storage("location").then((val)=>{
      if(val== null){
        this.rootPage = LocationPage;
      }else{
        this.location = String(val);
        this.location = this.location.replace('"', "");
        this.location = this.location.replace('"', "");
        console.log(this.location);
        this.Comprobar_sesion();
      }
    }).catch((e)=>{
      this.Cargar_location();
    })
  }


  ubicacion(){
    this.Funciones.Localizar().then((val)=>{
      if(val != false){
        console.log("ubicacion permitida");  //si val es diferente de false significa que si esta activado
      }else{
      this.ubicacion();
      }
  }).catch(()=>{
  this.ubicacion();
  })
}
  //Comprueba session
Comprobar_sesion(){
  this.afAuth.authState.subscribe(user => {
    if(user){
      this.uid = user.uid;
      this.Cargar_tipo(user.uid)
    }else{
      this.rootPage = LoginPage; //No existe session asi que manda a LoginPage
  }
    });
}

comprobar_tipo(uid:string){
  this.conductores =  this.afDB.list(`conductores/${this.location}/usuarios/${uid}`).valueChanges();
      this.conductores.subscribe(snapshot =>{
        if(snapshot[0]){ //es Conductor
            /**/
            this.miperfil = snapshot;
            this.perfil = snapshot[0];
            this.usuario = 'conductores';
            this.Guardar_tipo(uid+"/tipo",'conductores', snapshot);

        }else{
          this.pasajeros = this.afDB.list(`pasajeros/${this.location}/usuarios/${uid}`).valueChanges();
          this.pasajeros.subscribe(snapshot2 =>{
            if(snapshot2[0]){
              this.miperfil = snapshot2;
              this.perfil = snapshot2[0]; //Es Pasajero
              this.usuario = 'pasajeros';
                this.Guardar_tipo(uid+"/tipo",'pasajeros', snapshot);
            }else{ //No se ha registrado mandar a PerfilPage
              console.log("No se ha registrado");
              this.Funciones.Alert("Error", "No existe el usuario", null);
              this.Funciones.signOut();
            }
          });
        }
      });
}

//Carga la localidad
Cargar_tipo(txt){
  this.Funciones.Cargar_Storage(txt+"/tipo").then((val)=>{
    if( val != null){
      this.usuario = String(val);
      this.usuario = this.usuario.replace('"', "");
      this.usuario = this.usuario.replace('"', "");
      this.usuario = this.usuario;
      console.log(this.usuario);
      this.Verifica_perfil(2,this.usuario,null);
    }else{
            this.comprobar_tipo(txt);
            console.log(this.perfil)
    }

  }).catch((e)=>{
    console.log("Error al cargar el tipo de usuario")
  });

}


Guardar_tipo(titulo, tipo, snapshot){
  this.Funciones.Guardar_Storage(titulo,tipo).then(()=>{
    console.log("tipo Guardado");
    this.Guardar_perfil(this.uid+'perfil', this.perfil)

  }).catch(()=>{
    this.Guardar_tipo(titulo, tipo, snapshot);
  });
}

Verifica_perfil(donde, tipo:string, snapsho){
  if(donde == 1){
    if(tipo == "conductores"){
      if(!snapsho[1]){  //si hace falta informacion de pefil
      this.rootPage = InfoPerfilPage;
    }else{
      if( !snapsho[2]){ //si hace falta informacion de vehiculo
      this.rootPage = InfoVehiculoPage;
      }
    }
      if(snapsho[1] && snapsho[2]){
        this.rootPage = HomecPage;
        this.iniciar();

      }
    }
    if(tipo == "pasajeros"){
      if(snapsho[1]){
        this.rootPage = HomepPage;
        console.log(snapsho);
        this.iniciar();
      }else{
        this.rootPage = InfoPerfilPage;
      }
    }
  }
  if(donde == 2){
    this.perfilref = this.afDB.list(`${tipo}/${this.location}/usuarios/${this.uid}`).valueChanges();
    this.perfilref.subscribe(snapshot =>{

        if(tipo == "conductores"){
          if(!snapshot[1]){  //si hace falta informacion de pefil
          this.rootPage = InfoPerfilPage;
        }else{
          if( !snapshot[2]){
            this.miperfil = snapshot;
            this.perfil = snapshot[0]; //si hace falta informacion de vehiculo
          this.rootPage = InfoVehiculoPage;
          }
        }
          if(snapshot[1] && snapshot[2]){
            this.perfil = snapshot[0];
            this.miperfil = snapshot;
            this.iniciar();
            this.rootPage = (HomecPage);

          }
        }
        if(tipo == "pasajeros"){
          if(snapshot[1]){
            this.perfil = snapshot[0];
            this.miperfil = snapshot;
            console.log(snapshot);
            this.iniciar();
              //si hace falta informacion de pefil
            this.rootPage = (HomepPage);
        }else{
          this.rootPage = (InfoPerfilPage);
        }

        }
    });
  }

}


//Carga la localidad
Cargar_perfil(txt){
  this.Funciones.Cargar_Storage(txt+"/perfil").then((val)=>{
    if( val != null){
      this.perfil = val;

      this.Verifica_perfil(2,this.usuario,null);

    }else{
            this.comprobar_tipo(txt);
    }

  }).catch((e)=>{
    console.log("Error al cargar el tipo de usuario")
  });

}

Guardar_perfil(titulo, tipo){
  this.Funciones.Guardar_Storage(titulo,tipo).then(()=>{
    console.log("tipo Guardado");
    this.Cargar_tipo(this.uid);

  }).catch(()=>{
    this.Guardar_perfil(titulo, tipo);
  });
}


  openPage(page) {
    this.nav.setRoot(page.component);
  }
  salir(){
    this.Funciones.signOut();
  }
  iniciar(){
    this.buscar_historial();
    if(this.usuario == "pasajeros"){
      this.pages = [
          { title: 'Pedir Taxi', component: HomepPage, icon:'md-car' },
      ];
    }
    else{
      if(this.usuario == "conductores"){
        this.pages = [
            { title: 'Atender Taxi', component: HomecPage, icon:'md-car' },
        ];
      }else{
        this.pages = [
            { title: 'No se encontro', component: null, icon:'md-car' },
        ];
      }
    }
    console.log("Iniciado");
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    if(    this.platform.pause    ){
        this.borrar_mi();
    }
  }
  abrir() {
    this.nav.setRoot(EmergenciaPage);
  }
  borrar_mi(){
    //borrar mi ubicacion
    if(this.usuario=="conductores"){
      const itemRef = this.afDB.object(`conductores/${this.location}/ubicacion/${this.uid}`);
    itemRef.remove().then(()=>{
    });
    }
    
  }

  informacion(){
    console.log(this.miperfil);
    if(this.usuario == "conductores"){
      this.nav.setRoot(InformacionPage, {mi_perfil_conductor: this.miperfil, tipo: 'soy_conductor'});
    }
    if(this.usuario == "pasajeros"){
      this.nav.setRoot(InformacionPage, {mi_perfil_pasajero: this.miperfil, tipo: 'soy_pasajero'});

    }
  }

  viajes(){
    if(this.usuario == "conductores"){
      this.nav.setRoot(ViajesPage, {viajes: this.viaje, tipo: 'soy_conductor'});
    }
    if(this.usuario == "pasajeros"){
      this.nav.setRoot(ViajesPage, {viajes: this.viaje, tipo: 'soy_pasajero'});

    }
  }

  buscar_historial()
  {
    //pasajeros/${this.location}/historial/${this.esta_peticion.uid}/
    this.ref =  this.afDB.list(`${this.usuario}/${this.location}/historial/${this.uid}`).valueChanges()
    this.ref.subscribe(snapshot=>
    {
      this.viaje = snapshot;
      console.log(this.viaje);
    })
  }
}
