// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// //@ts-nocheck
// import { customer } from "./schema";
// import { faker } from "@faker-js/faker";
// import { db } from ".";

// const main = async () => {
//   const data: (typeof customer)[] = [];

//   for (let i = 0; i < 200; i++) {
//     data.push({
//       first_name: faker.person.firstName(),
//       last_name: faker.person.lastName(),
//       address: faker.location.streetAddress(),
//       city: faker.location.city(),
//       state: faker.location.state(),
//       zip: faker.location.zipCode(),
//       phone: faker.phone.number(),
//       company_id: "d583e7fd-d50c-4bf6-b1ca-cbd6e71a2fd3",
//       created_by: "5003a576-1d5c-4295-bec2-af05276cac72",
//     });
//   }
//   console.log(data);

//   console.log("Seed start");
//   await db.insert(customer).values(data);
//   console.log("Seed done");
// };

// main().then(() => {
//   console.log("done");
// });
