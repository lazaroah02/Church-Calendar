import { EVENTS_URL } from "@/api-endpoints"

type GetEventsProps = {
    start_date: string,
    end_date: string,
    group_by?: "month_days"
}

export async function getEvents({start_date, end_date, group_by="month_days"}: GetEventsProps){
    try{
        const res = await fetch(`${EVENTS_URL}?start_date=${start_date}&end_date=${end_date}&group_by=${group_by}`)
        if (res.ok) {
        return res.json()
            .then(data => {
                return data
            })
        } else {
            throw new Error('Error getting events')
        }
    }catch(err){
        console.log(err.message)
    }
}