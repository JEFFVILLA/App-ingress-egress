import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {}
  userName: string = '';
  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter(({ user }) => user !== null))
      .subscribe(({ user }) => (this.userName = user.name));
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logOut() {
    Swal.fire({
      title: 'Wait for LogOut',
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    this.authService
      .logOut()
      .then(() => {
        Swal.close();
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: err.code,
          text: err.message,
        });
      });
  }
}
