import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DieselbayScanPage } from './dieselbay-scan.page';

describe('DieselbayScanPage', () => {
  let component: DieselbayScanPage;
  let fixture: ComponentFixture<DieselbayScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DieselbayScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DieselbayScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
