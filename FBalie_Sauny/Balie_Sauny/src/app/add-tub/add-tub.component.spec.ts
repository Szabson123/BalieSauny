import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTubComponent } from './add-tub.component';

describe('AddTubComponent', () => {
  let component: AddTubComponent;
  let fixture: ComponentFixture<AddTubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
