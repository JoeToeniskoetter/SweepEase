import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import { Spinner } from "../Spinner";

export const UpcomingAppointments: React.FC = ({}) => {
  const router = useRouter();
  const customerId = router.query.id?.toString();
  const { data, isLoading } = api.appointment.upcomingByCustomerId.useQuery(
    {
      id: customerId ?? "",
    },
    {
      enabled: customerId !== undefined,
    }
  );
  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 p-4 flex justify-left">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              href="#"
              className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
            >
              Upcoming
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className="inline-block p-4 text-black border-b-2 border-transparent rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
              aria-current="page"
            >
              Previous
            </a>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          {isLoading && <Spinner />}
          {data?.length == 0 ? (
            <div className="flex justify-center">
              <p>No Upcoming Appointments</p>
            </div>
          ) : (
            <></>
          )}
          {data?.map((appt) => {
            return appt.id;
          })}
          <li>{}</li>
        </ul>
      </div>
    </div>
  );
};
