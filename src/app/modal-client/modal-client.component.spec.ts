import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalClientComponent } from './modal-client.component';

describe('ModalClientComponent', () => {
  let component: ModalClientComponent;
  let fixture: ComponentFixture<ModalClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalClientComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const formValues = component.clientForm.value;
    expect(formValues.name).toBe('');
    expect(formValues.phone).toBe('');
    expect(formValues.email).toBe('');
    expect(formValues.startDate).toBe('');
    expect(formValues.endDate).toBe('');
  });

  it('should mark form as invalid if required fields are missing', () => {
    component.clientForm.setValue({
      name: '',
      phone: '',
      email: '',
      startDate: '',
      endDate: ''
    });
    expect(component.clientForm.invalid).toBe(true);
  });

  it('should generate sharedKey correctly', () => {
    component.clientForm.setValue({
      name: 'John Doe',
      phone: '123456789',
      email: 'john.doe@example.com',
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    });
    component.saveClient();
    const clientData = {
      ...component.clientForm.value,
      sharedKey: 'jdoe'
    };
    expect(component.dialogRef.close).toHaveBeenCalledWith(clientData);
  });

  it('should call close with client data on saveClient', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.clientForm.setValue({
      name: 'John Doe',
      phone: '123456789',
      email: 'john.doe@example.com',
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    });
    component.saveClient();
    const clientData = {
      ...component.clientForm.value,
      sharedKey: 'jdoe'
    };
    expect(component.dialogRef.close).toHaveBeenCalledWith(clientData);
  });

  it('should close the dialog on cancel', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.onCancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
