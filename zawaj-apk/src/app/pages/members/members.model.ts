export interface Pagination {
    pageNumber: number;
    pageCount: number;
    pageSize: number;
    totalItemCount: number;
  }
  
export interface UserPagedList {
  users: UserList[];
  pagination: Pagination;
}

export interface UserList {
  id: string;
  userName: string;
  fullName: string;
  gender: string;
  age: number;
  nickName: string;
  lastActive: Date;
  createdOn: Date;
  updatedOn: Date;
  country: string;
  city: string;
  photoURL: string;
  isLiking: boolean;
}

export interface UserUpdate {
  about: string;
  lookingFor: string;
  interests: string;
  country: string;
  city: string;
}
