import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) { 
  }

  getTujuan(){
    return this.socket.fromEvent('tujuan');
  }

  setCordinate(data: any){
    this.socket.emit('cord', data);
  }

  getCordinate(){
    return this.socket.fromEvent('cordup');
  }



}
