import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicAddPage } from './music-add.page';

describe('MusicAddPage', () => {
  let component: MusicAddPage;
  let fixture: ComponentFixture<MusicAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
