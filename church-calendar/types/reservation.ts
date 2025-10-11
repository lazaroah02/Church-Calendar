import { UserInfo } from "./auth"

export type Reservation = {
    id: number
    created_at: string
    event: number,
    user: number,
    user_full_info: UserInfo
}