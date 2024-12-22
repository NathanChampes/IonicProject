import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicEditPage } from './music-edit.page';

describe('MusicEditPage', () => {
  let component: MusicEditPage;
  let fixture: ComponentFixture<MusicEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
