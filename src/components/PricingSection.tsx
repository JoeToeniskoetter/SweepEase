import Link from "next/link";
import React from "react";

export const PricingSection: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Simple Straight Forward Pricing
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Plan sizes that fit your business requirements.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          <PricingOption
            name="Starter"
            description="Try SweepEase before you commit!"
            price="Free"
            options={[
              "Store up to 200 customers",
              "Basic inspection report templates",
              "No setup, or hidden fees",
              "Basic email support",
            ]}
          />
          <PricingOption
            name="Company"
            description="Relevant for multiple users, extended & premium support."
            price="$99"
            monthly
            options={[
              "Store up to 200 customers",
              "Basic inspection report templates",
              "No setup, or hidden fees",
              "Basic email support",
            ]}
          />
          <PricingOption
            name="Enterprise"
            description="Best for large scale uses and extended redistribution rights."
            price="$199"
            monthly
            options={[
              "Store up to 200 customers",
              "Basic inspection report templates",
              "No setup, or hidden fees",
              "Basic email support",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

const PricingOption: React.FC<{
  name: string;
  description: string;
  price: string;
  options: string[];
  monthly?: boolean;
}> = ({ name, description, price, options, monthly = false }) => {
  return (
    <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 text-2xl font-semibold">{name}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
        {description}
      </p>
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-extrabold">{price}</span>
        {monthly && (
          <span className="text-gray-500 dark:text-gray-400">/month</span>
        )}
      </div>

      <ul role="list" className="mb-8 space-y-4 text-left">
        {options.map((option) => {
          return (
            <li className="flex items-center space-x-3" key={option}>
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>{option}</span>
            </li>
          );
        })}
      </ul>
      <Link
        href="#"
        className="bg-mrts-orange text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
      >
        Choose this plan
      </Link>
    </div>
  );
};
