import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

//Pagina

import { HomecPage } from '../pages/homec/homec';
import { HomepPage } from '../pages/homep/homep';
import { PeticionPage } from '../pages/peticion/peticion';
import { LocationPage } from '../pages/location/location';
import { CargandoPage } from '../pages/cargando/cargando';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { InfoPerfilPage } from '../pages/info-perfil/info-perfil';
import { InfoVehiculoPage } from '../pages/info-vehiculo/info-vehiculo';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { InternetPage } from '../pages/internet/internet';
import { PuntuarPage } from '../pages/puntuar/puntuar';
import {InformacionPage } from '../pages/informacion/informacion';
import { ViajePage } from '../pages/viaje/viaje';
import { ViajesPage } from '../pages/viajes/viajes';
import { EmergenciaPage } from '../pages/emergencia/emergencia';


import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { CuponPage } from '../pages/cupon/cupon';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Native
import { IonicStorageModule } from '@ionic/storage';
import { FuncionesProvider } from '../providers/funciones/funciones';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Network } from '@ionic-native/network';

//angularfire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CargaArchivosService } from '../providers/cargar';
//Mapa
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

export const firebaseConfig = {
  apiKey: "AIzaSyBppkPi-zm4z4_85bc7uhLCiAOeipf2s6c",
      authDomain: "pedirtaxi-2dbe8.firebaseapp.com",
      databaseURL: "https://pedirtaxi-2dbe8.firebaseio.com",
      projectId: "pedirtaxi-2dbe8",
      storageBucket: "pedirtaxi-2dbe8.appspot.com",
      messagingSenderId: "803830275778"
};

@NgModule({
  declarations: [
    MyApp,
    CargandoPage,
    LocationPage,
    LoginPage,
    SignupPage,
    InfoPerfilPage,
    InfoVehiculoPage,
    ConfiguracionPage,
    HomecPage,
    HomepPage,
    PeticionPage,
    InformacionPage,
    InternetPage,
    CuponPage,
    PuntuarPage,
    ViajePage,
    ViajesPage,
    EmergenciaPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgmSnazzyInfoWindowModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCS2jDjPCea-eg436bJ-JRnhkC5y9uuNto"
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CargandoPage,
    LocationPage,
    LoginPage,
    SignupPage,
    InfoPerfilPage,
    InfoVehiculoPage,
    ConfiguracionPage,
    HomecPage,
    HomepPage,
    PeticionPage,
    InformacionPage,
    InternetPage,
    CuponPage,
    PuntuarPage,
    ViajePage,
    ViajesPage,
    EmergenciaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    CallNumber,
    AngularFireDatabase,
    Camera,
    ImagePicker,
    Network,
    BackgroundGeolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FuncionesProvider,
    CargaArchivosService
  ]
})
export class AppModule {}
