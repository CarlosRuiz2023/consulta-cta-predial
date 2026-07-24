import { Injectable } from '@angular/core';

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class GeoserverService {

  private readonly wmsUrl =
    'http://172.17.11.168:8080/geoserver/sigFidoc/wms';

  constructor() { }

  addWmsLayer(
    map: any,
    layerName: string,
  ): any {

    const provider = new H.map.provider.ImageTileProvider({
      getURL: (col: number, row: number, level: number) => {
        const bbox = this.tileToBBox(col, row, level);
        const url = `${this.wmsUrl}?service=WMS&version=1.1.1&request=GetMap` +
          `&layers=${layerName}&styles=&format=image/png&transparent=true` +
          `&srs=EPSG:3857&width=256&height=256&bbox=${bbox}`;
        console.log('getURL llamado:', url);
        return url;
      },
      tileSize: 256,
      min: 0,
      max: 20
    });

    const layer = new H.map.layer.TileLayer(provider);

    map.addLayer(layer);

    return layer;
  }

  private tileToBBox(
    x: number,
    y: number,
    z: number
  ): string {

    const earthRadius = 6378137;
    const originShift = 2 * Math.PI * earthRadius / 2;
    const resolution =
      (2 * Math.PI * earthRadius / 256) / Math.pow(2, z);

    const minx = x * 256 * resolution - originShift;
    const maxx = (x + 1) * 256 * resolution - originShift;

    const maxy = originShift - y * 256 * resolution;
    const miny = originShift - (y + 1) * 256 * resolution;

    return `${minx},${miny},${maxx},${maxy}`;
  }

}
