import { Injectable } from "@angular/core";
import {
 HttpClient,
 HttpHeaders,
 HttpErrorResponse,
 HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
@Injectable({
 providedIn: "root"
})
export class ArticulosFamiliasService {
 resourceUrl: string;
 constructor(private httpClient: HttpClient) {
 this.resourceUrl = "https://pavii.ddns.net/api/ArticulosFamilias/";
 }
 get() {
 return this.httpClient.get(this.resourceUrl);
 }
}
