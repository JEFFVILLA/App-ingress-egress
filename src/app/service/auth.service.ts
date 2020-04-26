import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authACtions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.actions';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;

  private _user: Usuario;

  get getUser() {
    return { ...this._user };
  }
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    public store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fUser) => {
      if (fUser) {
        this.userSubscription = this.firestore
          .doc(`${fUser.uid}/usuario`)
          .valueChanges()
          .subscribe((fireStoreUser: any) => {
            const user = Usuario.fromFirebase(fireStoreUser);
            this._user = user;
            this.store.dispatch(authACtions.setUser({ user }));
          });
      } else {
        this._user = null;
        this.store.dispatch(authACtions.unSetUser());
        this.userSubscription?.unsubscribe();
        this.store.dispatch(unSetItems());
      }
    });
  }
  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fUser) => fUser != null));
  }
}
