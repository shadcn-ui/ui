<script lang="ts">
	import * as Select from "@/svelte-ui/select/index.js";

	let value = $state("");

	const triggerContent = $derived(value || "اختر فاكهة");
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class="w-32" dir="rtl">{triggerContent}</Select.Trigger>
	<Select.Content dir="rtl">
		<Select.Group>
			<Select.Label>الفواكه</Select.Label>
			<Select.Item value="apple">تفاح</Select.Item>
			<Select.Item value="banana">موز</Select.Item>
			<Select.Item value="blueberry">توت أزرق</Select.Item>
			<Select.Item value="grapes">عنب</Select.Item>
			<Select.Item value="pineapple">أناناس</Select.Item>
		</Select.Group>
		<Select.Separator />
		<Select.Group>
			<Select.Label>الخضروات</Select.Label>
			<Select.Item value="carrot">جزر</Select.Item>
			<Select.Item value="broccoli">بروكلي</Select.Item>
			<Select.Item value="spinach">سبانخ</Select.Item>
		</Select.Group>
	</Select.Content>
</Select.Root>
