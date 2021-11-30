import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeviationsPage } from './deviations.page';

describe('DeviationsPage', () => {
  let component: DeviationsPage;
  let fixture: ComponentFixture<DeviationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
