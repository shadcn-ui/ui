type invoice = {
  invoice: string,
  paymentStatus: string,
  totalAmount: string,
  paymentMethod: string,
}

let invoices: array<invoice> = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

@react.component
let make = () =>
  <Table>
    <Table.Caption>{"A list of your recent invoices."->React.string}</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head className="w-[100px]">{"Invoice"->React.string}</Table.Head>
        <Table.Head>{"Status"->React.string}</Table.Head>
        <Table.Head>{"Method"->React.string}</Table.Head>
        <Table.Head className="text-right">{"Amount"->React.string}</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {invoices->Array.map(invoice =>
         <Table.Row key={invoice.invoice}>
           <Table.Cell className="font-medium">{invoice.invoice->React.string}</Table.Cell>
           <Table.Cell>{invoice.paymentStatus->React.string}</Table.Cell>
           <Table.Cell>{invoice.paymentMethod->React.string}</Table.Cell>
           <Table.Cell className="text-right">{invoice.totalAmount->React.string}</Table.Cell>
         </Table.Row>
       )->React.array}
    </Table.Body>
    <Table.Footer>
      <Table.Row>
        <Table.Cell colSpan={3}>{"Total"->React.string}</Table.Cell>
        <Table.Cell className="text-right">{"$2,500.00"->React.string}</Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table>
