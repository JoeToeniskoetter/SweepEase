import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { Spinner } from "../Spinner";

type CompanyInfoForm = {
  name: string;
  logo: string;
};

export const SetupCompanyForm: React.FC = ({}) => {
  const { update } = useSession();
  const { mutateAsync } = api.company.create.useMutation({
    async onSuccess(data, _variables, _context) {
      await update({ company_id: data.id });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoForm>();
  const submit = async (values: CompanyInfoForm) => {
    await mutateAsync(values);
  };
  return (
    <div className="w-full p-6 bg-white">
      <div className="max-w-3xl mx-auto p-4 shadow-xl rounded-lg bg-white flex flex-col gap-4">
        <h1 className="dark:text-white text-2xl font-bold mb-3">
          Add Your Company Info
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="My Chimney Sweep Company"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="user_avatar"
          >
            Company Logo
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
          />
        </div>
        <button
          onClick={handleSubmit(submit)}
          type="submit"
          className="text-white bg-mrts-orange hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-mrts-orange dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center justify-center"
        >
          {isSubmitting ? <Spinner /> : "Create"}
        </button>
      </div>
    </div>
  );
};
