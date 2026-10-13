type accessTokenType = {
  access: string;
  refresh: string;
};

type LoginCredentialsType = {
  email: string;
  password: string;
  other: string;
};

type User = {
  name: string;
  user_type: string;
  // TODO: usunac nulla
  avatar: string | null;
  last_login: string;
  created: string;
};

type UserResponse = accessTokenType & {
  user: User;
};

export type { accessTokenType, LoginCredentialsType, User, UserResponse };
