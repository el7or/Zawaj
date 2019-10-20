import { Pagination } from './pagination';
export interface UserPagedList {
  users: UserList[],
  pagination:Pagination
}

export interface UserList {
  id: string,
  userName: string,
  fullName: string,
  gender: string,
  age: number,
  nickName: string,
  lastActive: Date,
  createdOn: Date,
  updatedOn: Date,
  country: string,
  city: string,
  photoURL: string
}
