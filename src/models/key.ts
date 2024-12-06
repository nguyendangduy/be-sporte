export interface Key {
  _id?: string;
  code: string;
  event: string;
  userId?: string | null;
  created_at?: Date;
  updated_at?: Date;
}