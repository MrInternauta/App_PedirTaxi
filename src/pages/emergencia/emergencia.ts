import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-emergencia',
  templateUrl: 'emergencia.html',
})
export class EmergenciaPage {

  numero:string="911";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private callNumber: CallNumber, public AlertCtrl:AlertController) {
  }

    llamar(){
      this.callNumber.callNumber(this.numero, true)
      .then(() => console.log('Marcador abierto!'))
      .catch(() => console.log('Error al abrir marcador'));
    }

    configNum(){
      let prompt = this.AlertCtrl.create({
        title: 'Número de emergencia',
        message: "El número que ingreses será al que llamarás en caso de tener una emergencia.",
        inputs: [
          {
            name: 'numero',
            placeholder: this.numero,
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel presionado');
            }
          },
          {
            text: 'Guardar',
            handler: data => {
              this.numero = data.numero;
              console.log(JSON.stringify(data));
              console.log(data);
            }
          }
        ]
      });
      prompt.present();
    }
  
    

}
