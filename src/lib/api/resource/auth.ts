import { User } from "./user";

export type LoginResponse = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
};
