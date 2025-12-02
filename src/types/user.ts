export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  nairoBalance: number;
  isPremium: boolean;
  preferredLanguage: string
  interests: string[];
}