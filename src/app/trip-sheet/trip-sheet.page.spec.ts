import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripSheetPage } from './trip-sheet.page';

describe('TripSheetPage', () => {
  let component: TripSheetPage;
  let fixture: ComponentFixture<TripSheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripSheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
