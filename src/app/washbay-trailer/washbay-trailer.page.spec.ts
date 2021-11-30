import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WashbayTrailerPage } from './washbay-trailer.page';

describe('WashbayTrailerPage', () => {
  let component: WashbayTrailerPage;
  let fixture: ComponentFixture<WashbayTrailerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashbayTrailerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WashbayTrailerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
