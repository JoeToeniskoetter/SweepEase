import { Transition } from "@headlessui/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Fragment, useState } from "react";
import Navbar from "~/components/Navbar";
import { CustomersTable } from "~/components/customers/CustomersTable";

export const transitionClasses = {
  enter: "transform transition ease-in-out duration-200 sm:duration-700",
  enterFrom: "-translate-x-full opacity-0",
  enterTo: "translate-x-0 opacity-100",
  leave: "transform transition ease-in-out duration-200 sm:duration-700 hidden",
  leaveFrom: "translate-x-0",
  leaveTo: "translate-x-full opacity-0",
};

export default function NewAppointmentPage({
  hello,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [step, setStep] = useState<number>(0);

  return (
    <div className="pt-20">
      <Navbar />
      <div className="h-full w-full">
        <div className="mx-auto max-w-2xl">
          <Transition as={Fragment} show={step === 0} {...transitionClasses}>
            <div className="h-60 p-2 rounded-xl shadow-xl">
              <p>Select a customer</p>
              <CustomersTable
                customers={[]}
                nextPage={() => {}}
                prevPage={() => {}}
                page={1}
                total_pages={1}
              />
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
          <button onClick={() => setStep(step + 1)}>Next</button>
          <button onClick={() => setStep(step - 1)}>Prev</button>
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
