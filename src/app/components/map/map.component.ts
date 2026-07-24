import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GeoserverService } from '../../services/geoserver.service';
declare var H: any;

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private geoserverService: GeoserverService
  ) { }

  ngAfterViewInit(): void {
    const platform = new H.service.Platform({
      apikey: 'RCzZF5zxfozUBuYKZVbAjllKiCFDE5C-vjGfAaktEQM'
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(
      this.mapContainer.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 15,
        center: {
          lat: 21.1225,
          lng: -101.6848
        }
      }
    );

    // Permite mover el mapa con el mouse
    new H.mapevents.Behavior(
      new H.mapevents.MapEvents(map)
    );

    // Agrega los controles (+, -, etc.)
    H.ui.UI.createDefault(map, defaultLayers);

    // Ajusta el tamaño al cargar
    window.addEventListener('resize', () => map.getViewPort().resize());

    this.geoserverService.addWmsLayer(map, 'sigFidoc:obra_geo');
    this.geoserverService.addWmsLayer(map, 'sigFidoc:frentes');
    this.geoserverService.addWmsLayer(map, 'sigFidoc:vw_predios_frentes');

    // Fuerza a HERE a recalcular qué tiles necesita después de agregar capas
    map.getViewPort().resize();
  }
}
