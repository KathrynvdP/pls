import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateItemPage } from './update-item.page';

describe('UpdateItemPage', () => {
  let component: UpdateItemPage;
  let fixture: ComponentFixture<UpdateItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
