import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarteraVencidaService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3500/api/carteraVencida';

  consultarDeudaVigenteSIFIDOC(cuenta: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/consultarDeudaVigenteSIFIDOC/${cuenta}`
    );
  }

  consultarDeudaVigenteSGP(cuenta: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/consultarDeudaVigenteSGP/${cuenta}`
    );
  }

  consultarDeudaVigenteGeocodificado(cuenta: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/consultarDeudaVigenteGeocodificado/${cuenta}`
    );
  }

}
