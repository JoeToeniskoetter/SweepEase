import { create } from "zustand";
import { type Customer } from "~/server/db/schema";

interface CustomerStore {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customer: null,
  setCustomer: (customer: Customer | null) =>
    set(() => ({ customer: customer })),
}));
