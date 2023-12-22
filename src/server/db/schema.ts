import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  date,
  numeric,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { sql, InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  company_id: text("company_id").references(() => company.id),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const company = pgTable("company", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"),
  created_at: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  created_by: text("created_by").notNull(),
});

export const customer = pgTable("customer", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  company_id: text("company_id")
    .notNull()
    .references(() => company.id),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address_id: text("address_id")
    .notNull()
    .references(() => address.id),
  created_at: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  created_by: text("created_by").notNull(),
});
export const customerRelations = relations(customer, ({ one }) => ({
  address: one(address, {
    fields: [customer.address_id],
    references: [address.id],
  }),
}));

export const address = pgTable("address", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  created_at: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  created_by: text("created_by").notNull(),
});
export const addressRelations = relations(address, ({ one }) => ({
  address: one(customer),
}));

export const service = pgTable("service", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  description: text("description").notNull(),
  company_id: text("company_id")
    .notNull()
    .references(() => company.id),
  created_at: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  created_by: text("created_by")
    .notNull()
    .references(() => users.id),
});

export const appointment = pgTable("appointment", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  customer_id: text("id")
    .notNull()
    .references(() => customer.id),
  company_id: text("company_id")
    .notNull()
    .references(() => company.id),
  service_id: text("service_id")
    .notNull()
    .references(() => service.id),
  date: date("date").notNull(),
  start_time: timestamp("start_time", { mode: "date" }).notNull(),
  end_time: timestamp("end_time", { mode: "date" }).notNull(),
  created_at: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  created_by: text("created_by")
    .notNull()
    .references(() => users.id),
  completed_at: timestamp("created_at", { mode: "date" }),
});
export const appointmentRelations = relations(appointment, ({ one }) => ({
  service: one(service, {
    fields: [appointment.service_id],
    references: [service.id],
  }),
  company: one(company, {
    fields: [appointment.company_id],
    references: [company.id],
  }),
  customer: one(customer, {
    fields: [appointment.customer_id],
    references: [customer.id],
  }),
}));

export const insertCompanySchema = createInsertSchema(company);
export const selectCustomerSchema = createSelectSchema(customer);
export const createCustomerSchema = createInsertSchema(customer);
export type Customer = InferSelectModel<typeof customer>;
export type Address = InferSelectModel<typeof address>;
export type CustomerWithAddress = Customer & { address: Address };
export type Company = InferSelectModel<typeof company>;
export type Service = InferSelectModel<typeof service>;
export type Appointment = InferSelectModel<typeof appointment>;
