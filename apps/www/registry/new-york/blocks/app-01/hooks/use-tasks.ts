"use client"

import useSWR from "swr"

import { API_URL } from "@/registry/new-york/blocks/app-01/lib/constants"

export function useTasks() {
  const { data, isLoading, mutate } = useSWR<{ tasks: string[] }>(
    "/api/tasks",
    async () => {
      const response = await fetch(API_URL)
      return response.json()
    }
  )

  return { tasks: data?.tasks || [], isLoading, mutate }
}
