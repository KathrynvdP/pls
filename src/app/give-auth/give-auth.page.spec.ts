import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiveAuthPage } from './give-auth.page';

describe('GiveAuthPage', () => {
  let component: GiveAuthPage;
  let fixture: ComponentFixture<GiveAuthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveAuthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiveAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
