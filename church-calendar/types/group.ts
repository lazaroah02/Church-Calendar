export type Group = {
    id: number
    name: string
    description: string
    img: string
    color: string
}

export type GroupReducedInfo = {
    name: string
    color: string
}

export interface GroupManagementData {
  img?: string | null  
  name: string;
  description: string;
  color: string;
}