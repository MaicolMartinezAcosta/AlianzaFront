import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ModalClientComponent } from '../modal-client/modal-client.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientServiceService } from '../service/client/client-service.service';

export interface Element {
  sharedKey: string;
  businessId: string;
  email: string;
  phone: string;
  dataAdded: string;
}

const ELEMENT_DATA: Element[] = [];

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  constructor(private dialog: MatDialog,
    private clientService :ClientServiceService,
  ){}
  displayedColumns: string[] = ['sharedKey', 'businessId', 'email', 'phone', 'dataAdded', 'edit'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  
  ngOnInit(): void {
    this.consultClients();
  }
  consultClients() {
    this.clientService.getAllClientes().subscribe(clientes => {
      clientes.forEach(cliente => {
        const element: Element = {
          sharedKey: cliente.sharedKey,
          businessId: cliente.name, 
          email: cliente.email,
          phone: cliente.phone,
          dataAdded: cliente.startDate 
        };
        ELEMENT_DATA.push(element);
      });
      this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  exportToCSV() {
    console.log('Exporting to CSV');
    const readyToExport = ELEMENT_DATA;

      const workBook = XLSX.utils.book_new(); 

      const workSheet = XLSX.utils.json_to_sheet(readyToExport);

      XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); 

      XLSX.writeFile(workBook, 'clients.xlsx'); 
  }

  create(newClient: any) {
    this.clientService.addCliente(newClient).subscribe(response => {
      ELEMENT_DATA.push({
        sharedKey: newClient.sharedKey,
        businessId: newClient.name, 
        email: newClient.email,
        phone: newClient.phone,
        dataAdded: newClient.startDate 
      });
      this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
      Swal.fire({
        icon: "success",
        title: "Client Save Success",
      });
    }, error => {
      console.error('Error al crear cliente', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    });
  }
  openModal(): void {
    const dialogRef = this.dialog.open(ModalClientComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró ' +result);
      if (result !== true ) {
        this.create(result);
      }
    });
  }

  editClient(){
    Swal.fire({
      text: "This option is not available at the moment.",
    });
  }
}
