<script lang="ts">
	import * as Tabs from "@/svelte-ui/tabs/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
</script>

<Tabs.Root value="overview" class="w-full max-w-sm" dir="rtl">
	<Tabs.List dir="rtl">
		<Tabs.Trigger value="overview">نظرة عامة</Tabs.Trigger>
		<Tabs.Trigger value="analytics">التحليلات</Tabs.Trigger>
		<Tabs.Trigger value="reports">التقارير</Tabs.Trigger>
		<Tabs.Trigger value="settings">الإعدادات</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="overview">
		<Card.Root dir="rtl">
			<Card.Header>
				<Card.Title>نظرة عامة</Card.Title>
				<Card.Description>
					عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع مشاريعك النشطة.
				</Card.Description>
			</Card.Header>
			<Card.Content class="text-sm text-muted-foreground">
				لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="analytics">
		<Card.Root dir="rtl">
			<Card.Header>
				<Card.Title>التحليلات</Card.Title>
				<Card.Description>
					تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص النمو.
				</Card.Description>
			</Card.Header>
			<Card.Content class="text-sm text-muted-foreground">
				زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="reports">
		<Card.Root dir="rtl">
			<Card.Header>
				<Card.Title>التقارير</Card.Title>
				<Card.Description>
					إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة للتحليل.
				</Card.Description>
			</Card.Header>
			<Card.Content class="text-sm text-muted-foreground">
				لديك ٥ تقارير جاهزة ومتاحة للتصدير.
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="settings">
		<Card.Root dir="rtl">
			<Card.Header>
				<Card.Title>الإعدادات</Card.Title>
				<Card.Description>
					إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.
				</Card.Description>
			</Card.Header>
			<Card.Content class="text-sm text-muted-foreground">
				تكوين الإشعارات والأمان والسمات.
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
