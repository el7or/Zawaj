export interface LikeList {
    id: string;
    nickName: string;
    gender: string;
    age: number;
    country: string;
    city: string;
    photoURL: string;
  }

  export interface LikeUser {
    likeFromUserId: string;
    likeToUserId: string;
  }