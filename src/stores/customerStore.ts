import { create } from "zustand";
import type { CustomerWithAddress } from "~/server/db/schema";

interface CustomerStore {
  customer: CustomerWithAddress | null;
  setCustomer: (customer: CustomerWithAddress | null) => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customer: null,
  setCustomer: (customer: CustomerWithAddress | null) =>
    set(() => ({ customer: customer })),
}));
