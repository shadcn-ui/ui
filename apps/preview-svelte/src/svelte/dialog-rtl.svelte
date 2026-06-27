<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Dialog from "@/svelte-ui/dialog/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
</script>

<Dialog.Root>
	<form>
		<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>فتح الحوار</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-sm" dir="rtl">
			<Dialog.Header>
				<Dialog.Title>تعديل الملف الشخصي</Dialog.Title>
				<Dialog.Description>
					قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="name-rtl">الاسم</Label>
					<Input id="name-rtl" name="name" defaultValue="Pedro Duarte" />
				</div>
				<div class="grid gap-3">
					<Label for="username-rtl">اسم المستخدم</Label>
					<Input id="username-rtl" name="username" defaultValue="@peduarte" />
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: "outline" })}>إلغاء</Dialog.Close>
				<button type="submit" class={buttonVariants()}>حفظ التغييرات</button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
