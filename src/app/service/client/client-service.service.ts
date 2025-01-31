import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  private baseUrl = 'http://localhost:8080/api/clients'; 

  constructor(private http: HttpClient) {}


  getAllClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }


  addCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, cliente);
  }
}
