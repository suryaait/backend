export class RegisterDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  isValid(): void {
    if (this.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }
}

export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
