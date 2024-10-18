import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.css']
})
export class ModalClientComponent {
  clientForm: FormGroup;
 constructor(
  public dialogRef: MatDialogRef<ModalClientComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any ,   
  private formBuilder: FormBuilder
) {
  this.clientForm = this.formBuilder.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });
}

saveClient(): void {
  if (this.clientForm.invalid) {

    return;
  }

  const nameParts = this.clientForm.value.name.split(' ');
  let sharedKey = '';

  if (nameParts.length >= 2) {
    sharedKey = nameParts[0].charAt(0).toLowerCase() + nameParts[nameParts.length - 1].toLowerCase();
  } else {
    sharedKey = nameParts[0].charAt(0).toLowerCase();
  }

  const clientData = {
    ...this.clientForm.value,
    sharedKey: sharedKey
  };

  this.dialogRef.close(clientData);
}

onCancel(): void {

  this.dialogRef.close();
}
}
