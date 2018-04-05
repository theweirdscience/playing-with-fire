import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativePricePositionComponent } from './relative-price-position.component';

describe('RelativePricePositionComponent', () => {
  let component: RelativePricePositionComponent;
  let fixture: ComponentFixture<RelativePricePositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativePricePositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativePricePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
