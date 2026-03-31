<script lang="ts">
	import * as Chart from "$lib/registry/ui/chart/index.js";
	import { scaleBand } from "d3-scale";
	import { BarChart } from "layerchart";

	const chartData = [
		{ month: "January", desktop: 186, mobile: 80 },
		{ month: "February", desktop: 305, mobile: 200 },
		{ month: "March", desktop: 237, mobile: 120 },
		{ month: "April", desktop: 73, mobile: 190 },
		{ month: "May", desktop: 209, mobile: 130 },
		{ month: "June", desktop: 214, mobile: 140 },
	];

	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "#2563eb",
		},
		mobile: {
			label: "Mobile",
			color: "#60a5fa",
		},
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
	<BarChart
		data={chartData}
		xScale={scaleBand().padding(0.25)}
		x="month"
		axis="x"
		seriesLayout="group"
		series={[
			{
				key: "desktop",
				label: chartConfig.desktop.label,
				color: chartConfig.desktop.color,
			},
			{
				key: "mobile",
				label: chartConfig.mobile.label,
				color: chartConfig.mobile.color,
			},
		]}
	>
		{#snippet tooltip()}
			<Chart.Tooltip />
		{/snippet}
	</BarChart>
</Chart.Container>
