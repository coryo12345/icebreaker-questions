export type JWT = string;

export type User = {
  id: number;
  username: string;
};

export type GenericToken = {
  iat: number;
  exp: number;
}

export type UserToken = User & GenericToken;