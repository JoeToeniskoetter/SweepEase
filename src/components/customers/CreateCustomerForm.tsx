import React from "react";
import { Controller, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useCustomerStore } from "~/stores/customerStore";
import { states } from "./states";
import { PlacesAutocomplete } from "./AutoCompleteAddress";

interface CreateCustomerForm {
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
}

export const CreateCustomerForm: React.FC<{
  afterCreate: () => void;
}> = ({ afterCreate }) => {
  const { customer } = useCustomerStore();
  const { mutateAsync: createCustomer } = api.customer.create.useMutation({
    onSuccess: () => {
      afterCreate();
    },
  });

  const { mutateAsync: updateCustomer } = api.customer.update.useMutation({
    onSuccess: () => {
      afterCreate();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
  } = useForm<CreateCustomerForm>({
    reValidateMode: "onSubmit",
    defaultValues:
      customer === null
        ? undefined
        : {
            ...customer,
            phone: customer.phone ?? "",
            email: customer.email ?? "",
            address1: customer.address.address1,
            address2: customer.address.address2 ?? "",
            city: customer.address.city,
            state: customer.address.state,
            zip: customer.address.zip,
          },
  });

  const onSubmit = async (values: CreateCustomerForm) => {
    if (customer !== null) {
      void toast.promise(
        updateCustomer({
          ...values,
          id: customer.id,
          address_id: customer.address.id,
        }),
        {
          success: "Customer Updated",
          pending: "Updating Customer",
          error: "Failed to Update Customer",
        }
      );
    } else {
      void toast.promise(createCustomer(values), {
        success: "Customer Created",
        pending: "Creating Customer",
        error: "Failed to Create Customer",
      });
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            First Name
          </label>
          <input
            {...register("first_name", { required: true })}
            className="border-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            placeholder="Jane"
          />
          <p className="text-red-200">{errors.first_name?.message}</p>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-last-name"
          >
            Last Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("last_name", { required: true })}
            placeholder="Doe"
          />
          {<p>{errors.last_name?.message}</p>}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Address
          </label>
          <Controller
            control={control}
            name="address1"
            render={({ field }) => (
              <PlacesAutocomplete
                existingAddress={field.value}
                onPlaceSelect={(details) => {
                  field.onChange(
                    `${details?.streetNumber} ${details?.address}`
                  );
                  setValue("city", details?.city ?? "");
                  setValue("state", details?.state ?? "");
                  setValue("zip", details?.zipCode ?? "");
                }}
              />
            )}
          />
          {<p>{errors.address1?.message}</p>}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Address line 2
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("address2")}
            placeholder="Apt. 1"
          />
          {<p>{errors.address1?.message}</p>}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-city"
          >
            City
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("city", { required: true })}
            placeholder="Albuquerque"
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-state"
          >
            State
          </label>
          <div className="relative">
            <select
              {...register("state", { required: true })}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
            >
              {states.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-zip"
          >
            Zip
          </label>
          <input
            {...register("zip", { required: true })}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-zip"
            type="text"
            placeholder="90210"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-zip"
          >
            Email
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("email")}
            placeholder="email@email.com"
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-zip"
          >
            Phone
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("phone", { required: true })}
            placeholder="555-555-5555"
          />
        </div>
      </div>
      <div className="w-full mt-4">
        <button
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
          className={`${
            !isValid ? "bg-gray-300" : "bg-mrts-orange"
          } text-white font-bold py-2 px-4 rounded w-full  mb-6 md:mb-0`}
        >
          {customer !== null ? "UPDATE" : "CREATE"}
        </button>
      </div>
    </div>
  );
};
