import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TyrebayTruckPage } from './tyrebay-truck.page';

describe('TyrebayTruckPage', () => {
  let component: TyrebayTruckPage;
  let fixture: ComponentFixture<TyrebayTruckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyrebayTruckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TyrebayTruckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
