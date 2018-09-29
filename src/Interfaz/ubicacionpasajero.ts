export interface ConfigPasajero {

  O_lat: number;
  O_lng:number;
  D_lat: number;
  D_lng:number;
  uid: string;
  estado: string;
  forma_pago:string;
  info_extra: string;
  tipo_servicio:string;
  equipaje: number;
  pasajeros: number;
  km: number;
  precio: number;
  date: Number;
}

export interface UbicacionPasajero {
  O_lat: number;
  O_lng:number;
  D_lat: number;
  D_lng:number;
}
