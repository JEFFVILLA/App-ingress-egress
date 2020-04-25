


export class Usuario {

  static fromFirebase({ email, name, uid }) {
    return new Usuario(uid, name, email);
  }

  constructor(
    public uid: string,
    public name: string,
    public email: string
  ) {

  }
}
