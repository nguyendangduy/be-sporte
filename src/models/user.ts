import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  phone: string;
  is_active: boolean;
  strava_token?: string;
  strava_refresh_token?: string;
  created_at?: Date;
  updated_at?: Date;
}
