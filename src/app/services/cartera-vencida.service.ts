import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarteraVencidaService {

  private http = inject(HttpClient);

  private api = environment.api.baseUrl;

  consultarDeudaVigenteSIFIDOC(cuenta: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/carteraVencida/consultarDeudaVigenteSIFIDOC/${cuenta}`
    );
  }

  consultarDeudaVigenteSGP(cuenta: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/carteraVencida/consultarDeudaVigenteSGP/${cuenta}`
    );
  }

  consultarDeudaVigenteGeocodificado(cuenta: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/carteraVencida/consultarDeudaVigenteGeocodificado/${cuenta}`
    );
  }

}
