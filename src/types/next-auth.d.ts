import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    address?: string;
  }

  interface Session {
    user: {
      id: string;
      address?: string;
      role: UserRole;
    } & DefaultSession["USER"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    address?: string;
  }
}
