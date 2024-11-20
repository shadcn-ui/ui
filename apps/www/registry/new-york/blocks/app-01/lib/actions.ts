"use server"

import { API_URL } from "@/registry/new-york/blocks/app-01/lib/constants"

export async function saveTask(formData: FormData) {
  const name = formData.get("name")

  // Get current tasks
  const response = await fetch(API_URL)
  const data = await response.json()
  const tasks = data.tasks || []

  // Add new task to array
  tasks.push(name)

  // Save updated tasks array
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ tasks }),
  })

  return { success: true }
}
