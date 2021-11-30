import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FuelRecordPage } from './fuel-record.page';

describe('FuelRecordPage', () => {
  let component: FuelRecordPage;
  let fixture: ComponentFixture<FuelRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelRecordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuelRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
