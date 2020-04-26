import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/service/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithModule } from '../ingreso-egreso.reducer';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;
  constructor(
    private store: Store<AppStateWithModule>,
    private ingresoEgresoServices: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => (this.ingresosEgresos = items));
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  delete(uid: string) {
    this.ingresoEgresoServices
      .deleteIngresoEgresos(uid)
      .then(() => {
        Swal.fire('Delete', 'Item Borrado', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', err.message, 'warning');
      });
  }
}
