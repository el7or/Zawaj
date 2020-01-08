export interface ChatUser {
    id:string;
    name:string;
    title:string;
    picture:string;
    unread:number;
}

export interface ChatAdd {
    senderId: string;
    receiverId:string;
    content:string;
}

export interface ChatCount {
    id:string;
    count:number;
}