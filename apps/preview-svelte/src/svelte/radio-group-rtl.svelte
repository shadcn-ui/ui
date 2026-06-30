<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as RadioGroup from "@/svelte-ui/radio-group/index.js";
</script>

<RadioGroup.Root value="comfortable" class="w-fit" dir="rtl">
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="default" id="r1-rtl" dir="rtl" />
		<Field.Content>
			<Field.Label for="r1-rtl" dir="rtl">افتراضي</Field.Label>
			<Field.Description dir="rtl">تباعد قياسي لمعظم حالات الاستخدام.</Field.Description>
		</Field.Content>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="comfortable" id="r2-rtl" dir="rtl" />
		<Field.Content>
			<Field.Label for="r2-rtl" dir="rtl">مريح</Field.Label>
			<Field.Description dir="rtl">مساحة أكبر بين العناصر.</Field.Description>
		</Field.Content>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="compact" id="r3-rtl" dir="rtl" />
		<Field.Content>
			<Field.Label for="r3-rtl" dir="rtl">مضغوط</Field.Label>
			<Field.Description dir="rtl">تباعد أدنى للتخطيطات الكثيفة.</Field.Description>
		</Field.Content>
	</Field.Field>
</RadioGroup.Root>
