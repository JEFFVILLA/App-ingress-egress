import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../service/ingreso-egreso.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit {


  ingresoEgresoForm: FormGroup;
  tipo = 'ingreso';
  constructor(private fb: FormBuilder,
    private ingresoEgreso: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
  }


  guardar() {

    if (this.ingresoEgresoForm.invalid) { return; }
    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgreso.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();
        Swal.fire('Registro Creado', descripcion, 'success');
      })
      .catch(err => {
        Swal.fire('Error', err.message, 'warning');
      });
  }

}
