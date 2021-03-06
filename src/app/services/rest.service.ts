import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private server = "localhost";
  private port = 8082;
  private protocol = "http";

  constructor(private http: HttpClient) { }

  getEndpoint(controller:string) {
    return `${this.getBaseUrl()}/${controller}`;
  }
  getItemEndpoint(controller:string, id?:string)
  {
    return id ? `${this.getEndpoint(controller)}/${id}` : this.getEndpoint(controller);
  }

  getBaseUrl() {
    return `${this.protocol}://${this.server}:${this.port}`;
  }

  post(controller:string, body: Object) {
    return this.http.post(this.getEndpoint(controller), body);
  }

  get(controller:string, id?: string) {
    return this.http.get(this.getItemEndpoint(controller, id))
  }

  delete(controller:string, id: string) {
    return this.http.delete(this.getItemEndpoint(controller, id));
  }

  put(controller:string, body: Object, id?: string) {
    return this.http.put(this.getItemEndpoint(controller, id), body)
  }
}
