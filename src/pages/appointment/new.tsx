import { Transition } from "@headlessui/react";
import { useDebounce } from "@uidotdev/usehooks";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { Fragment, useState } from "react";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

export const transitionClasses = {
  enter: "transform transition ease-in-out duration-200 sm:duration-700",
  enterFrom: "-translate-x-full opacity-0",
  enterTo: "translate-x-0 opacity-100",
  leave: "transform transition ease-in-out duration-200 sm:duration-700 hidden",
  leaveFrom: "translate-x-0",
  leaveTo: "translate-x-full opacity-0",
};

export default function NewAppointmentPage({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data } = api.customer.getAll.useQuery(
    {
      first_name: debouncedSearchTerm,
      last_name: debouncedSearchTerm,
      page: 1,
      page_size: 10,
    },
    { enabled: debouncedSearchTerm !== "" }
  );
  const [step, setStep] = useState<number>(0);

  return (
    <div className="pt-20">
      <Navbar />
      <div className="h-full w-full">
        <div className="mx-auto max-w-2xl">
          <button onClick={() => setStep(step + 1)}>Next</button>
          <button onClick={() => setStep(step - 1)}>Prev</button>
          <Transition as={Fragment} show={step === 0} {...transitionClasses}>
            <div className="p-2 rounded-xl shadow-xl">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search For Customer"
                className="w-full bg-gray-200 p-2 rounded-lg font-regular"
              />
              <div className="relative max-h-72 overflow-scroll">
                <ul className="flex flex-col gap-2 divide-solid divide-y ">
                  {data?.data.map((customer, idx) => {
                    return (
                      <li>
                        <div
                          className={`flex flex-col 
                             p-2 hover:bg-gray-200 hover:cursor-pointer`}
                        >
                          <p className="font-bold">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-gray-500">
                            {customer.address.address1}{" "}
                            {customer.address.address2}, {customer.address.city}
                            , {customer.address.state} {customer.address.zip}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Transition>
          <Transition as={Fragment} show={step === 1} {...transitionClasses}>
            <div className="h-60 p-2 rounded-xl shadow-xl">
              <p className="text-2xl">Step 2</p>
            </div>
          </Transition>
          <Transition as={Fragment} show={step === 2} {...transitionClasses}>
            <div className="h-60 p-2 rounded-xl shadow-xl">
              <p className="text-2xl">Step 3</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      hello: "hello",
    },
  };
}
