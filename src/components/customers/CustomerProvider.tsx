import { createContext, useContext, useState } from "react";
import { Customer } from "~/server/db/schema";

const CustomerContext = createContext<{
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
}>({
  setCustomer: (customer: Customer | null) => {
    null;
  },
  customer: null,
});

export const CustomerProvider = (props: { children: React.ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  return (
    <CustomerContext.Provider value={{ customer: customer, setCustomer }}>
      {props.children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
