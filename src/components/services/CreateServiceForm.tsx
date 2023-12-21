import React from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useServiceStore } from "~/stores/serviceStore";

interface CreateServiceForm {
  name: string;
  type: string;
  description: string;
  price: string;
}

export const NewServiceForm: React.FC<{
  afterCreate: () => void;
}> = ({ afterCreate }) => {
  const { service } = useServiceStore();
  const { mutateAsync: createCustomer } = api.service.create.useMutation({
    onSuccess: () => {
      afterCreate();
    },
  });

  const { mutateAsync: updateCustomer } = api.service.update.useMutation({
    onSuccess: () => {
      afterCreate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateServiceForm>({
    reValidateMode: "onSubmit",
    defaultValues: service
      ? { ...service, price: service.price?.toString() }
      : undefined,
  });

  const onSubmit = async (values: CreateServiceForm) => {
    if (service !== null) {
      void toast.promise(
        updateCustomer({
          ...values,
          id: service.id,
        }),
        {
          success: "Service Updated",
          pending: "Updating Service",
          error: "Failed to Update Service",
        }
      );
    } else {
      void toast.promise(createCustomer(values), {
        success: "Service Created",
        pending: "Creating Service",
        error: "Failed to Create Service",
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
            Name
          </label>
          <input
            {...register("name", { required: true })}
            className="border-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            placeholder="Level 1 Inspection"
          />
          <p className="text-red-200">{errors.name?.message}</p>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-last-name"
          >
            Type
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("type", { required: true })}
            placeholder="Cleaning"
          />
          {<p>{errors.type?.message}</p>}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Description
          </label>
          <textarea
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("description", { required: true })}
            placeholder="Inspection of chimney and firebox"
          />
          {<p>{errors.description?.message}</p>}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Price
          </label>
          <input
            type="number"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            {...register("price", { required: true })}
            placeholder="200.00"
          />
          {<p>{errors.price?.message}</p>}
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
          {service !== null ? "UPDATE" : "CREATE"}
        </button>
      </div>
    </div>
  );
};
