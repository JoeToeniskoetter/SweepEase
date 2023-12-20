import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { api } from "~/utils/api";

export const AppointmentsTab: React.FC = ({}) => {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date().toUTCString(),
    endDate: new Date().toUTCString(),
  });
  const { data } = api.appointment.getAll.useQuery(dateRange);
  const calendarRef = useRef<FullCalendar>(null);

  const CalendarHeader = () => {
    return (
      <div className="flex justify-between">
        <p className="text-2xl font-bold md:text-3xl max-w-fit font-poppins">
          {calendarRef.current?.getApi().view.title}
        </p>
        <div className="flex shadow-lg md:w-fit">
          <button
            className="rounded-none rounded-l-md bg-highlight w-12 items-center justify-center flex"
            onClick={() => {
              calendarRef.current?.getApi().prev();
            }}
          >
            <ArrowLeftIcon className="h-5 w-5 text-white" />
          </button>
          <button
            className="rounded-none md:w-fit p-2"
            onClick={() => {
              calendarRef.current?.getApi().today();
            }}
          >
            Today
          </button>
          <button
            className="rounded-none rounded-r-md bg-highlight w-12 items-center justify-center flex"
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
    <div className="w-full p-1 bg-white pt-8 px-8">
      <CalendarHeader />
      <FullCalendar
        select={(args) => {
          console.log(args);
        }}
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        selectable
        droppable
        editable
        timeZone="UTC"
        events={data}
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
        datesSet={(args) => {
          setDateRange({
            startDate: args.start.toUTCString(),
            endDate: args.end.toUTCString(),
          });
        }}
      />
    </div>
  );
};
