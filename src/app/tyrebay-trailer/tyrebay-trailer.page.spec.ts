import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TyrebayTrailerPage } from './tyrebay-trailer.page';

describe('TyrebayTrailerPage', () => {
  let component: TyrebayTrailerPage;
  let fixture: ComponentFixture<TyrebayTrailerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyrebayTrailerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TyrebayTrailerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
