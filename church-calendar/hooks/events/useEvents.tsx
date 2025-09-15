import { getEvents } from "@/services/events/get-events";
import { useEffect, useState } from "react";
import { CalendarUtils } from "react-native-calendars";

export function useEvents(){
    const today = CalendarUtils.getCalendarDateString(new Date());
    const [events, setEvents] = useState({})
    const [selectedDayEvents, setSelectedDayEvents] = useState([])
    const [interval, setInterval] = useState({start_date:"2025-09-01", end_date:"2025-09-30"})

    useEffect(() => {
        getEvents({start_date:interval.start_date, end_date:interval.end_date})
        .then(data => {
            setEvents(data)
            setSelectedDayEvents(data[today])
        })
        .catch(err => {console.log(err.message)})
    },[interval])

    function getSpecificDayEvents(date: string){
        return JSON.parse(JSON.stringify(events))[date]
    }

    return {events, setInterval, selectedDayEvents, setSelectedDayEvents, getSpecificDayEvents}
}