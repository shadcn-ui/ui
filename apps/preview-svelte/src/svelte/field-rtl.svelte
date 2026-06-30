<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import * as Select from "@/svelte-ui/select/index.js";
	import { Textarea } from "@/svelte-ui/textarea/index.js";

	let month = $state<string>();
	let year = $state<string>();
</script>

<div class="w-full max-w-md py-6" dir="rtl">
	<form>
		<Field.Group>
			<Field.Set>
				<Field.Legend>طريقة الدفع</Field.Legend>
				<Field.Description>جميع المعاملات آمنة ومشفرة</Field.Description>
				<Field.Group>
					<Field.Field>
						<Field.Label for="checkout-7j9-card-name-43j-rtl">الاسم على البطاقة</Field.Label>
						<Input id="checkout-7j9-card-name-43j-rtl" placeholder="Evil Rabbit" required />
					</Field.Field>
					<Field.Field>
						<Field.Label for="checkout-7j9-card-number-uw1-rtl">رقم البطاقة</Field.Label>
						<Input
							id="checkout-7j9-card-number-uw1-rtl"
							placeholder="1234 5678 9012 3456"
							required
						/>
						<Field.Description>أدخل رقم البطاقة المكون من 16 رقمًا</Field.Description>
					</Field.Field>
					<div class="grid grid-cols-3 gap-4">
						<Field.Field>
							<Field.Label for="checkout-exp-month-ts6-rtl">الشهر</Field.Label>
							<Select.Root type="single" bind:value={month}>
								<Select.Trigger id="checkout-exp-month-ts6-rtl">
									<span>{month || "ش.ش"}</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="01">٠١</Select.Item>
									<Select.Item value="02">٠٢</Select.Item>
									<Select.Item value="03">٠٣</Select.Item>
									<Select.Item value="04">٠٤</Select.Item>
									<Select.Item value="05">٠٥</Select.Item>
									<Select.Item value="06">٠٦</Select.Item>
									<Select.Item value="07">٠٧</Select.Item>
									<Select.Item value="08">٠٨</Select.Item>
									<Select.Item value="09">٠٩</Select.Item>
									<Select.Item value="10">١٠</Select.Item>
									<Select.Item value="11">١١</Select.Item>
									<Select.Item value="12">١٢</Select.Item>
								</Select.Content>
							</Select.Root>
						</Field.Field>
						<Field.Field>
							<Field.Label for="checkout-7j9-exp-year-f59-rtl">السنة</Field.Label>
							<Select.Root type="single" bind:value={year}>
								<Select.Trigger id="checkout-7j9-exp-year-f59-rtl">
									<span>{year || "YYYY"}</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="2024">2024</Select.Item>
									<Select.Item value="2025">2025</Select.Item>
									<Select.Item value="2026">2026</Select.Item>
									<Select.Item value="2027">2027</Select.Item>
									<Select.Item value="2028">2028</Select.Item>
									<Select.Item value="2029">2029</Select.Item>
								</Select.Content>
							</Select.Root>
						</Field.Field>
						<Field.Field>
							<Field.Label for="checkout-7j9-cvv-rtl">CVV</Field.Label>
							<Input id="checkout-7j9-cvv-rtl" placeholder="123" required />
						</Field.Field>
					</div>
				</Field.Group>
			</Field.Set>
			<Field.Separator />
			<Field.Set>
				<Field.Legend>عنوان الفوترة</Field.Legend>
				<Field.Description>
					عنوان الفوترة المرتبط بطريقة الدفع الخاصة بك
				</Field.Description>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Checkbox id="checkout-7j9-same-as-shipping-wgm-rtl" checked={true} />
						<Field.Label for="checkout-7j9-same-as-shipping-wgm-rtl" class="font-normal">
							نفس عنوان الشحن
						</Field.Label>
					</Field.Field>
				</Field.Group>
			</Field.Set>
			<Field.Set>
				<Field.Group>
					<Field.Field>
						<Field.Label for="checkout-7j9-optional-comments-rtl">تعليقات</Field.Label>
						<Textarea
							id="checkout-7j9-optional-comments-rtl"
							placeholder="أضف أي تعليقات إضافية"
							class="resize-none"
						/>
					</Field.Field>
				</Field.Group>
			</Field.Set>
			<Field.Field orientation="horizontal">
				<Button type="submit">إرسال</Button>
				<Button variant="outline" type="button">إلغاء</Button>
			</Field.Field>
		</Field.Group>
	</form>
</div>
