export interface SocialMedia {
  platform: "linkedin" | "instagram" | "x" | "facebook";
  url: string;
  isPrincipal?: boolean;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  socialMedia?: SocialMedia[];
}

export interface Photo {
  id: string;
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  user?: User;
  hashtags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
