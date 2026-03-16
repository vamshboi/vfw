// src/context/useEvents.js
import { createContext, useContext, useReducer } from "react";
import { initialEvents } from "../data/eventsdata";

const EventsContext = createContext(null);

function eventsReducer(state, action) {
  switch (action.type) {
    case "ADD_EVENT":
      return {
        ...state,
        events: [
          ...state.events,
          { ...action.payload, id: Date.now() },
        ],
      };
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload),
      };
    default:
      return state;
  }
}

export function EventsProvider({ children }) {
  const [state, dispatch] = useReducer(eventsReducer, {
    events: initialEvents,
  });

  const addEvent = (event) => dispatch({ type: "ADD_EVENT", payload: event });
  const deleteEvent = (id) => dispatch({ type: "DELETE_EVENT", payload: id });

  return (
    <EventsContext.Provider value={{ events: state.events, addEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used inside EventsProvider");
  return ctx;
}