import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class GenericService {
    public baseUrl: string = environment.apiUrl;
    public platformBaseUrl: string = environment.syncthingApiUrl;
    public http: HttpClient;
    public headers = new HttpHeaders()
    .set('Content-type', 'application/json');

    constructor(_http: HttpClient, public authService: AuthService) {
        this.http = _http;
    }

    public authAccess() {
        let currentUser = this.authService.currentUserValue;
        this.headers = this.headers.set('Authorization', 'Bearer ' + currentUser.accessToken);
    }

    public getById(id: number, endpoint: string): Observable<any> {
        return this.http.get(this.baseUrl + endpoint + '?Id=' + id, { headers: this.headers });
    }

    public get(endpoint: string): Observable<any> {
        return this.http.get(this.baseUrl + endpoint, { headers: this.headers });
    }

    public getPlatform(endpoint: string): Observable<any> {
        return this.http.get(this.platformBaseUrl + endpoint, { headers: this.headers });
    }

    public getWithParameterBody(endpoint: string, body: any): Observable<any> {
        return this.http.post(this.platformBaseUrl + endpoint, body, { headers: this.headers }, )
    }

    // get(url: string, options: 
    //{ 
        //headers?: HttpHeaders | { [header: string]: string | string[]; } | undefined; 
        //context?: HttpContext | undefined; 
        //observe?: "body" | undefined; 
        //params?: HttpParams | { ...; } | undefined; 
        //reportProgress?: boolean | undefined; 
        //responseType: "arraybuffer"; 
        //withCredentials?: boolean | undefined; }): Observable<ArrayBuffer>

    // public getParamString(id: string, endpoint: string): Observable<any>{
    //     return this.http.get<any>(this.baseUrl + endpoint + '/' + id, { headers: this.headers });
    // }

    // public getList(): Observable<any>{
    //     return this.http.get<any>(this.baseUrl + '/GetAll', { headers: this.headers });
    // }

    public post(object: any, endpoint: string): Observable<any>{
        return this.http.post(this.baseUrl + endpoint, JSON.stringify(object), { headers: this.headers });
    }

    public postSOS(object: any, endpoint: string): Observable<any>{
        return this.http.post(this.baseUrl + endpoint, object, { headers: this.headers });
    }
    
    public postnoobject(endpoint: string): Observable<any>{
        return this.http.post(this.baseUrl + endpoint, { headers: this.headers });
    }

    public put(object: any, endpoint: string): Observable<any> {
        return this.http.put(this.baseUrl + endpoint, JSON.stringify(object), { headers: this.headers });
    }

    public delete(id: number, endpoint: string): Observable<any> {
        return this.http.delete(this.baseUrl + endpoint + '/' + id, { headers: this.headers });
    }

}