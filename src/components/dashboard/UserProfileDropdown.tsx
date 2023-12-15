import { Dropdown, Avatar } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export const UserProfileDropdown: React.FC = ({}) => {
  const { data } = useSession();
  return (
    <Dropdown
      label={
        <Avatar alt="User settings" img={data?.user.image ?? ""} rounded />
      }
      arrowIcon={false}
      inline
    >
      <Dropdown.Header>
        <span className="block text-sm">{data?.user.name}</span>
        <span className="block truncate text-sm font-medium">
          {data?.user.email}
        </span>
      </Dropdown.Header>
      <Link href={"/dashboard"}>
        <Dropdown.Item>Dashboard</Dropdown.Item>
      </Link>
      <Link href={"/api/auth/signout"}>
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Link>
    </Dropdown>
  );
};
