import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MapComponent } from './components/map/map.component';
import { CarteraVencidaService } from './services/cartera-vencida.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

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
  mapComponent!: MapComponent;
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

    forkJoin({
      sifidoc: this.carteraService.consultarDeudaVigenteSIFIDOC(cuenta),
      sgp: this.carteraService.consultarDeudaVigenteSGP(cuenta),
      geo: this.carteraService.consultarDeudaVigenteGeocodificado(cuenta)
    }).subscribe({
      next: ({ sifidoc, sgp, geo }) => {

        this.resultado1 = JSON.stringify(sifidoc, null, 2);
        this.resultado2 = JSON.stringify(sgp, null, 2);
        this.resultado3 = JSON.stringify(geo, null, 2);

        this.mapComponent.mostrarResultados(geo.data.items);

        // Aquí ya tienes las tres respuestas
        this.compararResultados(sifidoc, sgp);

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  compararResultados(sifidoc: any, sgp: any) {

  console.log('SIFIDOC:', sifidoc);
  console.log(sifidoc.data.data.reng);
  console.log('SGP:', sgp);
  console.log(sgp.data.data.reng);
}
}
