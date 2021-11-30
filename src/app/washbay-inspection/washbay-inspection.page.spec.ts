import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WashbayInspectionPage } from './washbay-inspection.page';

describe('WashbayInspectionPage', () => {
  let component: WashbayInspectionPage;
  let fixture: ComponentFixture<WashbayInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashbayInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WashbayInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
