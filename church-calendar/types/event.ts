import { UserInfo } from "./auth";
import { GroupReducedInfo } from "./group";

export type DateString = `${number}-${number}-${number}` | string; // "YYYY-MM-DD"

export type Interval = {
  start_date: DateString;
  end_date: DateString;   
}

export interface GetEventsProps extends Interval {
    group_by?: "month_days" | "",
    token?: string | undefined | null
}

export type EventId = string

export type Event = {
    id: EventId
    title: string
    start_time: string
    end_time: string
    img: string | null
    description: string
    location: string
    created_by: number | null
    las_edit_by: number | null
    groups: number[]
    is_canceled: boolean
    visible: boolean
    open_to_reservations: boolean
    reservations_limit: number | null
    created_at: string
    updated_at: string
    groups_full_info: GroupReducedInfo[]
    created_by_full_info: UserInfo
    last_edit_by_full_info: UserInfo
}

export type EventFormType = {
    title: string
    start_time: Date
    end_time: Date
    img?: string | null
    description: string
    location: string
    groups: number[]
    is_canceled: boolean
    visible: boolean
    open_to_reservations: boolean
    reservations_limit?: number | null
}