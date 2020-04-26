import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../service/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm: FormGroup;
  tipo = 'ingreso';

  loading: boolean = false;

  loadingSubs: Subscription;
  constructor(
    private fb: FormBuilder,
    private ingresoEgreso: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadingSubs = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }
  guardar() {
    if (this.ingresoEgresoForm.invalid) {
      return;
    }
    this.store.dispatch(isLoading());

    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgreso
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch(stopLoading());
        Swal.fire('Registro Creado', descripcion, 'success');
      })
      .catch((err) => {
        this.store.dispatch(stopLoading());
        Swal.fire('Error', err.message, 'warning');
      });
  }
}
