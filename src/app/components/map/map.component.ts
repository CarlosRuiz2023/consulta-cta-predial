import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GeoserverService } from '../../services/geoserver.service';
import { environment } from '../../../environments/environment';

declare var H: any;

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: any;
  ui!: any;
  markersGroup!: any;

  constructor(
    private geoserverService: GeoserverService
  ) { }

  ngAfterViewInit(): void {

    const platform = new H.service.Platform({
      apikey: environment.here.apiKey
    });

    const defaultLayers = platform.createDefaultLayers();

    this.map = new H.Map(
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

    // Grupo de marcadores
    this.markersGroup = new H.map.Group();
    this.map.addObject(this.markersGroup);

    // Permite mover el mapa
    new H.mapevents.Behavior(
      new H.mapevents.MapEvents(this.map)
    );

    // Controles del mapa
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // Capas WMS
    this.geoserverService.addWmsLayer(this.map, 'sigFidoc:obra_geo');
    this.geoserverService.addWmsLayer(this.map, 'sigFidoc:frentes');
    this.geoserverService.addWmsLayer(this.map, 'sigFidoc:vw_predios_frentes');

    // Popup al hacer clic
    this.map.addEventListener('tap', (evt: any) => {

      const target = evt.target;

      if (target instanceof H.map.Marker) {

        const bubble = new H.ui.InfoBubble(
          target.getGeometry(),
          {
            content: target.getData()
          }
        );

        this.ui.addBubble(bubble);
      }

    });

    // Resize
    window.addEventListener('resize', () => {
      this.map.getViewPort().resize();
    });

    this.map.getViewPort().resize();

  }

  mostrarResultados(items: any[]): void {

    // Borra marcadores anteriores
    this.markersGroup.removeAll();

    if (!items || items.length === 0) {
      return;
    }

    // Crear límites para hacer zoom
    const bounds = new H.geo.Rect(
      items[0].position.lat,
      items[0].position.lng,
      items[0].position.lat,
      items[0].position.lng
    );

    items.forEach((item: any) => {

      const marker = new H.map.Marker({
        lat: item.position.lat,
        lng: item.position.lng
      });

      marker.setData(`
        <strong>${item.title}</strong><br>
        Score: ${(item.scoring.queryScore * 100).toFixed(0)}%
      `);

      this.markersGroup.addObject(marker);

      bounds.mergePoint({
        lat: item.position.lat,
        lng: item.position.lng
      });

    });

    this.map.getViewModel().setLookAtData({
      bounds
    });

  }

}
