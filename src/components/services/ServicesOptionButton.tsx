import { Menu, Transition } from "@headlessui/react";
import { Fragment, type SVGProps } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Customer } from "~/server/db/schema";

interface ServiceOptionsButtonsProps {
  onEdit: () => void;
}

export default function ServiceOptionsButtons(
  props: ServiceOptionsButtonsProps
) {
  return (
    <Menu as="div" className="flex items-center justify-center">
      <div>
        <Menu.Button className={"items-center justify-center flex"}>
          <EllipsisVerticalIcon
            className="h-5 w-5 text-center"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={props.onEdit}
                  className={`${
                    active ? "bg-mrts-orange text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <EditActiveIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <EditInactiveIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-mrts-orange text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <DeleteActiveIcon
                      className="mr-2 h-5 w-5 text-violet-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <DeleteInactiveIcon
                      className="mr-2 h-5 w-5 text-violet-400"
                      aria-hidden="true"
                    />
                  )}
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function EditInactiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#fadbc8"
        stroke="#F57F37"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#F57F37"
        stroke="#fadbc8"
        strokeWidth="2"
      />
    </svg>
  );
}

function DeleteInactiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#fadbc8"
        stroke="#F57F37"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#F57F37" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#F57F37" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#F57F37"
        stroke="#fadbc8"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#fadbc8" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#fadbc8" strokeWidth="2" />
    </svg>
  );
}
