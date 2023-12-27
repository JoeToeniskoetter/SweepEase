"use client";

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import Navbar from "~/components/Navbar";
import { env } from "~/env";
import { api } from "~/utils/api";
import { Spinner } from "~/components/Spinner";

const CustomerById: React.FC = ({}) => {
  const { query } = useRouter();
  const { data, isLoading } = api.customer.byId.useQuery({
    id: query.id?.toString() ?? "",
  });
  const position = { lat: 61.2176, lng: -149.8997 };

  //   useEffect(() => {
  //     if (data?.address) {
  //       (async () => {
  //         const geo = await getGeocode({ address: data.address.address1 });
  //         console.log(geo);
  //       })();
  //     }
  //   }, [data?.id]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="pt-20 flex gap-1 bg-gray-100">
        <Navbar />
        <div className="w-1/3 max-w-md bg-white h-full p-4 m-4 rounded-xl shadow-md">
          <p className="font-bold text-lg py-4">
            {data?.first_name} {data?.last_name}
          </p>
          <div className="w-full h-[1px] bg-gray-400" />
          <div className="py-4">
            <p>
              <span className="font-bold">Last Service:</span> 12/30/2023
            </p>
            <p>
              <span className="font-bold">Customer #:</span> {data?.id}
            </p>
            <p>
              <span className="font-bold">Created:</span>{" "}
              {data?.created_at.toLocaleDateString()}
            </p>
          </div>
          <div className="w-full h-[1px] bg-gray-400" />
          <div className="py-4">
            <p>
              <span className="font-bold text-lg">Contact Info:</span>
            </p>
            <div className="py-2">
              <p className="text-md text-gray-400 font-bold">Email </p>
              <p>{data?.email ?? "---"}</p>
            </div>
            <div className="py-2">
              <p className="text-md text-gray-400 font-bold">Phone: </p>
              <p>{data?.phone}</p>
            </div>
            <div className="py-2">
              <p className="text-md text-gray-400 font-bold">Address: </p>
              <p>{data?.address?.address1}</p>
              <p>
                {data?.address?.city}, {data?.address.state} {data?.address.zip}
              </p>
            </div>
          </div>
        </div>
        <div className="w-2/3 p-4">
          <APIProvider
            apiKey={env.NEXT_PUBLIC_CLIENT_GOOGLE_AUTOCOMPLETE_API_KEY}
          >
            <Map
              className="w-full h-full rounded-md rounded-bl-md shadow-md"
              center={position}
              zoom={15}
            >
              <Marker position={position} />
            </Map>
          </APIProvider>
        </div>
      </div>
      {/* <UpcomingAppointments /> */}
    </div>
  );
};

export default CustomerById;
