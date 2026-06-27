<script lang="ts">
	import * as Table from "@/svelte-ui/table/index.js";

	const invoices = [
		{
			invoice: "INV001",
			paymentStatus: "مدفوع",
			totalAmount: "$250.00",
			paymentMethod: "بطاقة ائتمانية",
		},
		{
			invoice: "INV002",
			paymentStatus: "قيد الانتظار",
			totalAmount: "$150.00",
			paymentMethod: "PayPal",
		},
		{
			invoice: "INV003",
			paymentStatus: "غير مدفوع",
			totalAmount: "$350.00",
			paymentMethod: "تحويل بنكي",
		},
		{
			invoice: "INV004",
			paymentStatus: "مدفوع",
			totalAmount: "$450.00",
			paymentMethod: "بطاقة ائتمانية",
		},
		{
			invoice: "INV005",
			paymentStatus: "مدفوع",
			totalAmount: "$550.00",
			paymentMethod: "PayPal",
		},
		{
			invoice: "INV006",
			paymentStatus: "قيد الانتظار",
			totalAmount: "$200.00",
			paymentMethod: "تحويل بنكي",
		},
		{
			invoice: "INV007",
			paymentStatus: "غير مدفوع",
			totalAmount: "$300.00",
			paymentMethod: "بطاقة ائتمانية",
		},
	];
</script>

<Table.Root dir="rtl">
	<Table.Caption>قائمة بفواتيرك الأخيرة.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">الفاتورة</Table.Head>
			<Table.Head>الحالة</Table.Head>
			<Table.Head>الطريقة</Table.Head>
			<Table.Head class="text-end">المبلغ</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each invoices as invoice (invoice)}
			<Table.Row>
				<Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
				<Table.Cell>{invoice.paymentStatus}</Table.Cell>
				<Table.Cell>{invoice.paymentMethod}</Table.Cell>
				<Table.Cell class="text-end">{invoice.totalAmount}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	<Table.Footer>
		<Table.Row>
			<Table.Cell colspan={3}>المجموع</Table.Cell>
			<Table.Cell class="text-end">$2,500.00</Table.Cell>
		</Table.Row>
	</Table.Footer>
</Table.Root>
