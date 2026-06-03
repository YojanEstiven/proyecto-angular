import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { IaService } from './ia';

describe('IaService', () => {
  let service: IaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IaService,
        provideHttpClient() // Esto le da el HttpClient que necesita para no fallar
      ]
    });
    service = TestBed.inject(IaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
