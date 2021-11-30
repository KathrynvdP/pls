import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WashbayTruckPage } from './washbay-truck.page';

describe('WashbayTruckPage', () => {
  let component: WashbayTruckPage;
  let fixture: ComponentFixture<WashbayTruckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashbayTruckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WashbayTruckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
