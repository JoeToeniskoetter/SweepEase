import { create } from "zustand";
import type { Service } from "~/server/db/schema";

interface ServiceStore {
  service: Service | null;
  setService: (service: Service | null) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  service: null,
  setService: (service: Service | null) => set(() => ({ service: service })),
}));
