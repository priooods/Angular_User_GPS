import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  readonly baseURL = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  Login(body: any){
    return this.http.post(this.baseURL + 'login', body, {
      observe: 'body',
    });
  }

  Register(body: any){
    return this.http.post(this.baseURL + 'user', body, {
      observe:'body',
    })
  }

  Lokasi(nama: string, body: any){
    return this.http.post(this.baseURL + 'updateuser/' + nama, body, {
      observe: 'body',
    })
  }

  getDetailUser(nama: string){
    return this.http.get(this.baseURL + 'getuser/' + nama);
  }

}
