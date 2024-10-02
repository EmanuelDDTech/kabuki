export interface UserListResponse {
  count: number;
  next: string;
  previous: null;
  results: Result[];
}

export interface Result {
  verified: boolean;
  token: string;
  id: number;
  email: string;
  password: string;
  name: string;
}
