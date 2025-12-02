export interface UserProfileFormErrors{
    full_name: string;
    email: string;
    phone_number: string;
    description?: string;
    profile_img: any;
    general?: string;
}

export interface UserManagementFormErrors{
    full_name: string;
    email: string;
    phone_number: string;
    description?: string;
    profile_img: any;
}

export interface UserManagementData {
  profile_img?: string | null  
  full_name: string;
  phone_number: string;
  email: string;
  description: string;
  member_groups: number[];
  is_staff: boolean;
  is_active: boolean
}