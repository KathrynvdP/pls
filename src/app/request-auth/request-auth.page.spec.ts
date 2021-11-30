import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestAuthPage } from './request-auth.page';

describe('RequestAuthPage', () => {
  let component: RequestAuthPage;
  let fixture: ComponentFixture<RequestAuthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAuthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
