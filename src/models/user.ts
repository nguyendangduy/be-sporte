export interface User {
  _id?: string;
  email: string;
  name: string;
  phone: string;
  code_uprace?: string;
  created_at?: Date;
  updated_at?: Date;
}