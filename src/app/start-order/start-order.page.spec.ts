import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartOrderPage } from './start-order.page';

describe('StartOrderPage', () => {
  let component: StartOrderPage;
  let fixture: ComponentFixture<StartOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
