<script lang="ts">
	import CalculatorIcon from "~icons/ms/calculate";
	import CalendarIcon from "~icons/ms/calendar_month";
	import CreditCardIcon from "~icons/ms/credit_card";
	import SettingsIcon from "~icons/ms/settings";
	import SmileIcon from "~icons/ms/mood";
	import UserIcon from "~icons/ms/person";
	import * as Command from "@/svelte-ui/command/index.js";
</script>

<Command.Root class="max-w-sm rounded-lg border" dir="rtl">
	<Command.Input placeholder="اكتب أمرًا أو ابحث..." dir="rtl" />
	<Command.List>
		<Command.Empty>لم يتم العثور على نتائج.</Command.Empty>
		<Command.Group heading="اقتراحات">
			<Command.Item>
				<CalendarIcon />
				<span>التقويم</span>
			</Command.Item>
			<Command.Item>
				<SmileIcon />
				<span>البحث عن الرموز التعبيرية</span>
			</Command.Item>
			<Command.Item disabled>
				<CalculatorIcon />
				<span>الآلة الحاسبة</span>
			</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="الإعدادات">
			<Command.Item>
				<UserIcon />
				<span>الملف الشخصي</span>
				<Command.Shortcut>⌘P</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<CreditCardIcon />
				<span>الفوترة</span>
				<Command.Shortcut>⌘B</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<SettingsIcon />
				<span>الإعدادات</span>
				<Command.Shortcut>⌘S</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Root>
