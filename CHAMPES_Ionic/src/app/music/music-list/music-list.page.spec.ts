import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicListPage } from './music-list.page';

describe('MusicListPage', () => {
  let component: MusicListPage;
  let fixture: ComponentFixture<MusicListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
