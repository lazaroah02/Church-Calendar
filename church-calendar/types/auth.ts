import { GroupReducedInfo } from "./group";

export type UserInfo = {
  id: number
  email: string
  username: string
  phone_number: string
  full_name: string
  profile_img: string
  description: string
  is_staff: boolean
  is_active: boolean
  is_superuser: boolean
  member_groups: number[]
  member_groups_full_info: GroupReducedInfo[]
};

export type Session = {
  token: string;
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