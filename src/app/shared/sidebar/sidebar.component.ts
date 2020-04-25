import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    Swal.fire({
      title: 'Wait for LogOut',
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    this.authService.logOut()
      .then(() => {
        Swal.close();
        this.router.navigate(['/login']);
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: err.code,
          text: err.message
        });
      });

  }

}
