import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVehiculo } from './form-vehiculo';

describe('FormVehiculo', () => {
  let component: FormVehiculo;
  let fixture: ComponentFixture<FormVehiculo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVehiculo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormVehiculo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
