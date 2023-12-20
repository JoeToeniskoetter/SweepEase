import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

interface AppointmentsTabProps {}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({}) => {
  const calendarRef = useRef<FullCalendar>(null);

  const CalendarHeader = () => {
    return (
      <div className="flex justify-between">
        <p className="text-2xl font-bold md:text-3xl max-w-fit font-poppins">
          {calendarRef.current?.getApi().view.title}
        </p>
        <div className="flex w-full shadow-sm md:w-fit">
          <button
            className="w-full rounded-none rounded-l-md bg-slate-500"
            onClick={() => {
              calendarRef.current?.getApi().prev();
            }}
          >
            <ArrowLeftIcon className="h-5 w-5 text-white" />
          </button>
          <button
            color="light"
            className="w-full rounded-none md:w-fit"
            onClick={() => {
              calendarRef.current?.getApi().today();
            }}
          >
            Today
          </button>
          <button
            className="w-full rounded-none rounded-r-md md:w-fit bg-slate-500"
            onClick={() => {
              calendarRef.current?.getApi().next();
            }}
          >
            <ArrowRightIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="w-11/12 p-1 bg-white">
      <CalendarHeader />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        selectable
        droppable
        editable
        timeZone="UTC"
        customButtons={{
          test: {
            text: "sup",
          },
        }}
        headerToolbar={{
          left: "",
          right: "",
          center: "",
        }}
      />
    </div>
  );
};
