/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { address, customer } from "./schema";
import { faker } from "@faker-js/faker";
import { db } from ".";

const main = async () => {
  // const company = await db.
  for (let i = 0; i < 200; i++) {
    const a = await db
      .insert(address)
      .values({
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        phone: faker.phone.number(),
        created_by: "17024737-2d58-4ec0-a5aa-311c28451e7d",
      })
      .returning();

    await db.insert(customer).values({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      address_id: a[0]?.id,
      phone: faker.phone.number(),
      company_id: "5fa87dcd-16e6-49ad-a99d-98e6e6a6164b",
      created_by: "17024737-2d58-4ec0-a5aa-311c28451e7d",
    });
  }
};

main().then(() => {
  console.log("done");
});
