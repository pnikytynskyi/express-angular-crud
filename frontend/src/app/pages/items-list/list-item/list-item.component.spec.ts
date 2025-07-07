import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListItemComponent} from './list-item.component';
import {WarehouseItem} from '../../../core/models/warehouseItem';
import {By} from '@angular/platform-browser';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;

  const mockItem: WarehouseItem = {
    id: 1,
    name: 'Test Product',
    quantity: 10,
    unitPrice: 99.99,
    imageUrl: '',
    description: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListItemComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit startEdit when Edit button is clicked', () => {
    spyOn(component.startEdit, 'emit');

    const editBtn = fixture.debugElement.query(By.css('[data-testid="edit-button"]'));
    editBtn.triggerEventHandler('click', null);

    expect(component.startEdit.emit).toHaveBeenCalledWith(mockItem);
  });

  it('should emit deleteItem when Delete button is clicked', () => {
    spyOn(component.deleteItem, 'emit');

    const deleteBtn = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
    deleteBtn.triggerEventHandler('click', null);

    expect(component.deleteItem.emit).toHaveBeenCalledWith(mockItem.id);
  });
});
