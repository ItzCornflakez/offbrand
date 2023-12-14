export class Users {
  constructor(
    public user_id: number,
    public role: string,
    public email: string,
    public password: string,
    public created_at: string,
    public updated_at: string,
  ) {}
}

export class UserDetails {
  constructor(
    public user_id: number,
    public role: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public phone_number: string,
    public addres_1: string,
    public addres_2: string,
    public city: string,
    public postal_code: string,
  ) {}
}
