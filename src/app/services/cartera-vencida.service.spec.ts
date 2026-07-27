import { TestBed } from '@angular/core/testing';

import { CarteraVencidaService } from './cartera-vencida.service';

describe('CarteraVencidaService', () => {
  let service: CarteraVencidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarteraVencidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
