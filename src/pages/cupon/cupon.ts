import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FuncionesProvider } from '../../providers/funciones/funciones';

import { UbicacionConductor } from '../../Interfaz/ubicacionconductor';

/**
 * Generated class for the CuponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cupon',
  templateUrl: 'cupon.html',
})
export class CuponPage {
  public cup:any;
  

  mi_ubicacion = {} as UbicacionConductor;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public Funciones: FuncionesProvider) {
        
                this.cup = 0;
                
  }

  genCup(){
    
    this.Funciones.uid().then((val)=>{
      if(val != null){
        console.log("generando cupon");
        this.mi_ubicacion.uid = String(val) //Da valor a uid
        this.cup = 'PEDIR'+ this.mi_ubicacion.uid + 'TAXI'
      }
      })
  }

}
