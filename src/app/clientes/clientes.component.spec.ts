import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ClientesComponent, Element } from './clientes.component';
import { ClientServiceService } from '../service/client/client-service.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

jest.mock('sweetalert2');

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let mockClientService: jest.Mocked<ClientServiceService>;
  let dialog: jest.Mocked<MatDialog>;

  const MOCK_CLIENTES = [
    {
      sharedKey: 'ABC123',
      name: 'Business 1',
      email: 'client1@business.com',
      phone: '1234567890',
      startDate: '2023-01-01'
    },
    {
      sharedKey: 'DEF456',
      name: 'Business 2',
      email: 'client2@business.com',
      phone: '0987654321',
      startDate: '2023-02-01'
    }
  ];

  beforeEach(async () => {
    mockClientService = {
      getAllClientes: jest.fn(),
      addCliente: jest.fn(),
    } as unknown as jest.Mocked<ClientServiceService>;

    dialog = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      declarations: [ClientesComponent],
      imports: [MatTableModule, MatDialogModule],
      providers: [
        { provide: ClientServiceService, useValue: mockClientService },
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display clients on ngOnInit', () => {
    mockClientService.getAllClientes.mockReturnValue(of(MOCK_CLIENTES));

    component.ngOnInit();

    expect(mockClientService.getAllClientes).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2); 
    expect(component.dataSource.data[0].sharedKey).toBe('ABC123');
    expect(component.dataSource.data[1].businessId).toBe('Business 2');
  });

  it('should filter data when applyFilter is called', () => {
    component.dataSource.data = MOCK_CLIENTES.map(cliente => ({
      sharedKey: cliente.sharedKey,
      businessId: cliente.name,
      email: cliente.email,
      phone: cliente.phone,
      dataAdded: cliente.startDate
    }));

    const event = { target: { value: 'abc' } } as unknown as Event;
    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('abc');
  });

  /*it('should export to CSV when exportToCSV is called', () => {
    // Agregar datos al dataSource
    component.dataSource.data = MOCK_CLIENTES.map(cliente => ({
      sharedKey: cliente.sharedKey,
      businessId: cliente.name,
      email: cliente.email,
      phone: cliente.phone,
      dataAdded: cliente.startDate
    }));
  
    const spyXLSX = jest.spyOn(XLSX.utils, 'json_to_sheet').mockReturnValue({});
    const spyWriteFile = jest.spyOn(XLSX, 'writeFile').mockImplementation(() => {});
  
    component.exportToCSV();
  
    expect(spyXLSX).toHaveBeenCalled();
    expect(spyWriteFile).toHaveBeenCalledWith(expect.any(Object), 'clients.xlsx');
  });*/
  

  it('should open modal and create a new client', () => {
    dialog.open.mockReturnValue({
      afterClosed: () => of(MOCK_CLIENTES[0])
    } as any);

    mockClientService.addCliente.mockReturnValue(of(MOCK_CLIENTES[0]));

    component.openModal();

    expect(dialog.open).toHaveBeenCalled();
    expect(mockClientService.addCliente).toHaveBeenCalledWith(MOCK_CLIENTES[0]);
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Client Save Success",
    });
  });

  it('should show SweetAlert when editClient is called', () => {
    component.editClient();
    expect(Swal.fire).toHaveBeenCalledWith({
      text: "This option is not available at the moment.",
    });
  });
});
