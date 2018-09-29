import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';
import { CargandoPage } from '../cargando/cargando';
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private Funciones: FuncionesProvider) {

  }

  Guardar(estados:string, municipios:string){
      if(estados){
        if(estados=='Veracruz de Ignacio de la Llave'){
          if(municipios == 'Coatzacoalcos'){
            let location = estados+"/"+municipios;
            console.log(location);
            this.Funciones.Guardar_Storage("location",location).then(()=>{
              this.Funciones.Alert("Guardado", "correctamente", null);
              this.navCtrl.setRoot(CargandoPage);
            }).catch(()=>{
              this.Guardar(estados, municipios);
            })
          }else{
            this.Funciones.Alert("Aun no llegamos", "Aun no llegamos a tu cuidad", null);

          }

        }else{
          this.Funciones.Alert("Aun no llegamos", "Aun no llegamos a tu estado", null);
        }
      }else{
        this.Funciones.Alert("Selecciona algo", "Selecciona un estado", null);
      }

  }

}
