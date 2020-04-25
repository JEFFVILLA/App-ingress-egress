import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  loading: boolean = false;
  uiSuscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSuscription = this.store.select('ui').subscribe(uiLoading => this.loading = uiLoading.isLoading);
  }

  ngOnDestroy() {
    this.uiSuscription.unsubscribe();
  }

  login() {

    if (this.loginForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Wait for Login',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { email, password } = this.loginForm.value;
    console.log(this.loginForm.value);
    this.auth.login(email, password)
      .then(credenciales => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);

      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: err.code,
          text: err.message
        });
      });
  }



}
