import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthorisePage } from './authorise.page';

describe('AuthorisePage', () => {
  let component: AuthorisePage;
  let fixture: ComponentFixture<AuthorisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
