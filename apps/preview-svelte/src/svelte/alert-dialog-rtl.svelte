<script lang="ts">
	import BluetoothIcon from "~icons/ms/bluetooth";
	import * as AlertDialog from "@/svelte-ui/alert-dialog/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";
</script>

<div class="flex gap-4" dir="rtl">
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
			إظهار الحوار
		</AlertDialog.Trigger>
		<AlertDialog.Content dir="rtl">
			<AlertDialog.Header>
				<AlertDialog.Title>هل أنت متأكد تمامًا؟</AlertDialog.Title>
				<AlertDialog.Description>
					لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>إلغاء</AlertDialog.Cancel>
				<AlertDialog.Action>متابعة</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
			إظهار الحوار (صغير)
		</AlertDialog.Trigger>
		<AlertDialog.Content size="sm" dir="rtl">
			<AlertDialog.Header>
				<AlertDialog.Media>
					<BluetoothIcon />
				</AlertDialog.Media>
				<AlertDialog.Title>السماح للملحق بالاتصال؟</AlertDialog.Title>
				<AlertDialog.Description>
					هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>عدم السماح</AlertDialog.Cancel>
				<AlertDialog.Action>السماح</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
