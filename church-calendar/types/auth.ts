import { GroupReducedInfo } from "./group";

export type UserInfo = {
  id: number
  email: string
  username: string
  phone_number: string
  full_name: string
  profile_img: string
  description: string
  fcm_token: string
  timezone: string
  is_staff: boolean
  is_active: boolean
  is_superuser: boolean
  born_at: string
  member_groups: number[]
  member_groups_full_info: GroupReducedInfo[]
};

export type Session = {
  token: string | null | undefined;
  userInfo: UserInfo;
};

export interface LoginResponse{
    token:string
    user_info: UserInfo
}

export type LoginFormErrors = {
  email?: string;
  pass?: string;
  general?: string;
};

export interface SignInProps {
  email: string;
  pass: string;
  onLoginSuccess: () => void;
  onLoginError: (err: Error) => void;
}

export interface RegisterProps {
  data: RegisterData
  onSuccess: () => void;
  onError: (err: Error) => void;
}

export interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  full_name: string;
  born_at: Date;
  phone_number: string;
  member_groups: number[];
}

export interface AuthContenxtProps {
  signIn: ({ email, pass, onLoginSuccess, onLoginError }: SignInProps) => void;
  register: ({ data, onSuccess, onError }: RegisterProps) => void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
  isGuestUser: boolean
  updateGuestStatus: (newStatus: boolean) => void
  updateSession: (newSession: Session) => void;
}

export type ChangePasswordFormData = {
  password1: string,
  password2: string
}