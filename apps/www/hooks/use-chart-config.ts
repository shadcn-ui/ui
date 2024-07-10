import useSWR from "swr"

export function useChartConfig() {
  const { data, mutate } = useSWR("chart:config", null)

  return { chartConfig: data, setChartConfig: mutate }
}
