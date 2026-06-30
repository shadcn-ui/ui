<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
</script>

<Card.Root class="w-full max-w-sm" dir="rtl">
	<Card.Header>
		<Card.Title>تسجيل الدخول إلى حسابك</Card.Title>
		<Card.Description>أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك</Card.Description>
		<Card.Action>
			<Button variant="link">إنشاء حساب</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label for="email-rtl">البريد الإلكتروني</Label>
					<Input id="email-rtl" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password-rtl">كلمة المرور</Label>
						<a
							href="#"
							class="ms-auto inline-block text-sm underline-offset-4 hover:underline"
						>
							نسيت كلمة المرور؟
						</a>
					</div>
					<Input id="password-rtl" type="password" required />
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Button type="submit" class="w-full">تسجيل الدخول</Button>
		<Button variant="outline" class="w-full">تسجيل الدخول باستخدام Google</Button>
	</Card.Footer>
</Card.Root>
