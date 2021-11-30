import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SigniturePageComponent } from './signiture-page.component';

describe('SigniturePageComponent', () => {
  let component: SigniturePageComponent;
  let fixture: ComponentFixture<SigniturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigniturePageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SigniturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
