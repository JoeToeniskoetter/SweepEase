import { create } from "zustand";
import type { Appointment } from "~/server/db/schema";

interface AppointmentStore {
  selectedAppointment: Appointment | null;
  setAppointment: (customer: Appointment | null) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  selectedAppointment: null,
  setAppointment: (appointment: Appointment | null) =>
    set(() => ({ selectedAppointment: appointment })),
}));
