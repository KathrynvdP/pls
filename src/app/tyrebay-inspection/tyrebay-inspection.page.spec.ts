import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TyrebayInspectionPage } from './tyrebay-inspection.page';

describe('TyrebayInspectionPage', () => {
  let component: TyrebayInspectionPage;
  let fixture: ComponentFixture<TyrebayInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyrebayInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TyrebayInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
