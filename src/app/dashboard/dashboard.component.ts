import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../service/ingreso-egreso.service';
import * as ingresoEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresosService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.ingresosSubs = this.ingresoEgresosService
          .initIngresosEgresosListiner(user.uid)
          .subscribe((ingresosEgresosFb) => {
            this.store.dispatch(
              ingresoEgresosActions.setItems({ items: ingresosEgresosFb })
            );
          });
      });
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
    this.ingresosSubs?.unsubscribe();
  }
}
