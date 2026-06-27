<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
</script>

<Field.Group class="max-w-sm" dir="rtl">
	<Field.Field orientation="horizontal">
		<Checkbox id="terms-checkbox-rtl" name="terms-checkbox" />
		<Label for="terms-checkbox-rtl">قبول الشروط والأحكام</Label>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<Checkbox id="terms-checkbox-2-rtl" name="terms-checkbox-2" checked />
		<Field.Content>
			<Field.Label for="terms-checkbox-2-rtl">
				قبول الشروط والأحكام
			</Field.Label>
			<Field.Description>
				بالنقر على هذا المربع، فإنك توافق على الشروط.
			</Field.Description>
		</Field.Content>
	</Field.Field>
	<Field.Field orientation="horizontal" data-disabled>
		<Checkbox id="toggle-checkbox-rtl" name="toggle-checkbox" disabled />
		<Field.Label for="toggle-checkbox-rtl">تفعيل الإشعارات</Field.Label>
	</Field.Field>
	<Field.Label>
		<Field.Field orientation="horizontal">
			<Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
			<Field.Content>
				<Field.Title>تفعيل الإشعارات</Field.Title>
				<Field.Description>
					يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.
				</Field.Description>
			</Field.Content>
		</Field.Field>
	</Field.Label>
</Field.Group>
