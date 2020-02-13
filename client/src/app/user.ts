
import { Profile } from './profile';

export class User {
  id: number;
  username: string;
  password: string;
  is_superuser: boolean;
  profile: Profile;
}
