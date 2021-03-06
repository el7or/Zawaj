export interface PhotoDetails {
  id: number;
  url: string;
  description: string;
  isMain: boolean;
  isApproved: boolean;
  createdOn: Date;
  updatedOn: Date;
}
