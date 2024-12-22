import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DJSETPage } from './djset.page';

describe('DJSETPage', () => {
  let component: DJSETPage;
  let fixture: ComponentFixture<DJSETPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DJSETPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
