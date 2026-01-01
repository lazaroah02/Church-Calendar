import React, { createContext, useContext } from "react";
import { useCalendarEventsLogic } from "./useCalendarEventsLogic"; 
import type { Event, DateString, Interval } from "@/types/event";
import { DateData } from "react-native-calendars";


// --- Context Types ---

/**
 * Defines the structure of the values that CalendarContext will provide.
 * Includes all values intended to be globally available.
 */
interface CalendarContextType {
    // Calendar Data
    events: { [date: string]: Event[] };
    loadingEvents: boolean;
    errorEvents: Error | null;

    // Refetch and Interval Update Functions
    refetchEvents: () => Promise<any>;
    onRefetch: () => Promise<void>;
    interval: Interval; // current visible month interval
    setInterval: (interval: { start_date: DateString; end_date: DateString }) => void;
    getSpecificDayEvents: (date: DateString) => Event[];

    // Selected Day State and Events (the state to store/share)
    selectedDay: DateData;
    setSelectedDay: (day: DateData) => void;
    selectedDayEvents: Event[]; // Events for the selected day
}

// --- Context Creation ---

/**
 * The context that will store the calendar state and functions.
 * It is initialized with 'undefined' and checked in the consumer hook.
 */
export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// --- Context Provider ---

/**
 * Provider component that wraps the application (or the part of the application
 * that needs access to the calendar state).
 * Executes useCalendarEventsLogic and provides its results to the context.
 */
export function CalendarContextProvider({ children }: { children: React.ReactNode }) {
    // Calls your custom hook 'useCalendarEventsLogic' which contains all the TanStack Query logic
    const contextValue = useCalendarEventsLogic();

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
}

// --- Consumer Hook ---

/**
 * Custom hook for safe and easy consumption of the CalendarContext.
 * Ensures that the hook is used within a CalendarProvider.
 */
export function useCalendarEventsContext() {
    const context = useContext(CalendarContext);

    if (context === undefined) {
        throw new Error('useCalendarContext must be used within a CalendarProvider');
    }

    return context;
}