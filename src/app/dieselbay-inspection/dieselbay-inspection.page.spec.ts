import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DieselbayInspectionPage } from './dieselbay-inspection.page';

describe('DieselbayInspectionPage', () => {
  let component: DieselbayInspectionPage;
  let fixture: ComponentFixture<DieselbayInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DieselbayInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DieselbayInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
