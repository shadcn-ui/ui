import { faker } from "@faker-js/faker"

import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  return Array.from({ length: 100 }, () => ({
    id: faker.random.alphaNumeric(8),
    amount: faker.datatype.number({ min: 100, max: 1000 }),
    status: faker.helpers.arrayElement([
      "success",
      "pending",
      "failed",
      "processing",
    ]),
    email: faker.internet.email(),
  }))
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
