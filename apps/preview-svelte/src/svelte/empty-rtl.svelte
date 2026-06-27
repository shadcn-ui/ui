<script lang="ts">
	import * as Empty from "@/svelte-ui/empty/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import FolderCodeIcon from "~icons/ms/folder_code";
	import ArrowUpRightIcon from "~icons/ms/north_east";
</script>

<Empty.Root dir="rtl">
	<Empty.Header>
		<Empty.Media variant="icon">
			<FolderCodeIcon />
		</Empty.Media>
		<Empty.Title>لا توجد مشاريع بعد</Empty.Title>
		<Empty.Description>
			لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content class="flex-row justify-center gap-2">
		<Button>إنشاء مشروع</Button>
		<Button variant="outline">استيراد مشروع</Button>
	</Empty.Content>
	<Button variant="link" class="text-muted-foreground" size="sm">
		<a href="#/">
			تعرف على المزيد <ArrowUpRightIcon class="inline rtl:rotate-[270deg]" />
		</a>
	</Button>
</Empty.Root>
