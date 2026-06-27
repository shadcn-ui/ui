<script lang="ts">
	import * as Menubar from "@/svelte-ui/menubar/index.js";

	let profile = $state("benoit");
	let bookmarks = $state(false);
	let fullUrls = $state(true);
</script>

<Menubar.Root dir="rtl">
	<Menubar.Menu>
		<Menubar.Trigger>ملف</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				علامة تبويب جديدة <Menubar.Shortcut>⌘T</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>
				نافذة جديدة <Menubar.Shortcut>⌘N</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>نافذة التصفح المتخفي الجديدة</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Sub>
				<Menubar.SubTrigger>مشاركة</Menubar.SubTrigger>
				<Menubar.SubContent>
					<Menubar.Item>رابط البريد الإلكتروني</Menubar.Item>
					<Menubar.Item>الرسائل</Menubar.Item>
					<Menubar.Item>الملاحظات</Menubar.Item>
				</Menubar.SubContent>
			</Menubar.Sub>
			<Menubar.Separator />
			<Menubar.Item>
				طباعة... <Menubar.Shortcut>⌘P</Menubar.Shortcut>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>تعديل</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				تراجع <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>
				إعادة <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Sub>
				<Menubar.SubTrigger>بحث</Menubar.SubTrigger>
				<Menubar.SubContent>
					<Menubar.Item>البحث على الويب</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>بحث...</Menubar.Item>
					<Menubar.Item>البحث التالي</Menubar.Item>
					<Menubar.Item>البحث السابق</Menubar.Item>
				</Menubar.SubContent>
			</Menubar.Sub>
			<Menubar.Separator />
			<Menubar.Item>قص</Menubar.Item>
			<Menubar.Item>نسخ</Menubar.Item>
			<Menubar.Item>لصق</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>عرض</Menubar.Trigger>
		<Menubar.Content class="w-44">
			<Menubar.CheckboxItem bind:checked={bookmarks}>شريط الإشارات المرجعية</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={fullUrls}>عناوين URL الكاملة</Menubar.CheckboxItem>
			<Menubar.Separator />
			<Menubar.Item inset>
				إعادة تحميل <Menubar.Shortcut>⌘R</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item inset>
				إعادة تحميل قسري <Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item inset>تبديل وضع ملء الشاشة</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item inset>إخفاء الشريط الجانبي</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>الملفات الشخصية</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.RadioGroup bind:value={profile}>
				<Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
				<Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
				<Menubar.RadioItem value="Luis">Luis</Menubar.RadioItem>
			</Menubar.RadioGroup>
			<Menubar.Separator />
			<Menubar.Item inset>تعديل...</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item inset>إضافة ملف شخصي...</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
