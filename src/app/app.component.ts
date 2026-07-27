import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MapComponent } from './components/map/map.component';
import { CarteraVencidaService } from './services/cartera-vencida.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterOutlet,
    MapComponent,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild(MapComponent)
  mapComponent!:MapComponent;
  cuentaPredial = new FormControl('');
  resultado1 = '';
  resultado2 = '';
  resultado3 = '';

  constructor(
    private carteraService: CarteraVencidaService
  ) { }

  buscar() {

    const cuenta = this.cuentaPredial.value?.trim();

    if (!cuenta) {
      return;
    }

    this.carteraService.consultarDeudaVigenteSIFIDOC(cuenta)
      .subscribe({
        next: (resp:any) => {
          // Lo imprimimos bonito en el textarea
          this.resultado1 = JSON.stringify(resp, null, 2);
        },
        error: (err:any) => {
          console.error(err);
          this.resultado1 = JSON.stringify(err.error ?? err, null, 2);
        }
      });
    this.carteraService.consultarDeudaVigenteSGP(cuenta)
      .subscribe({
        next: (resp:any) => {
          // Lo imprimimos bonito en el textarea
          this.resultado2 = JSON.stringify(resp, null, 2);
        },
        error: (err:any) => {
          console.error(err);
          this.resultado2 = JSON.stringify(err.error ?? err, null, 2);
        }
      });
    this.carteraService.consultarDeudaVigenteGeocodificado(cuenta)
      .subscribe({
        next: (resp:any) => {
          console.log(resp);
          // Lo imprimimos bonito en el textarea
          this.resultado3 = JSON.stringify(resp, null, 2);
          this.mapComponent.mostrarResultados(resp.data.items);
        },
        error: (err:any) => {
          console.error(err);
          this.resultado3 = JSON.stringify(err.error ?? err, null, 2);
        }
      });
  }
}
