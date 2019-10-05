import { PhotoDetails } from './photo-details';

export interface UserDetails {
  id: string;
  userName: string;
  fullName: string;
  gender: string;
  age: number;
  nickName: string;
  lastActive: Date;
  createdOn: Date;
  updatedOn: Date;
  about?: string;
  lookingFor?: string;
  interests?: string;
  country: string;
  city: string;
  photoURL: string;
  photos: PhotoDetails[];
}
