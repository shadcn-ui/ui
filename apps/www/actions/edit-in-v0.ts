"use server"

export async function editInV0({
  description,
  code,
}: {
  description: string
  code: string
}) {
  const url = `${process.env.V0_URL}/api/edit`
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ description, code, source: "ui.shadcn.com" }),
    headers: {
      "x-v0-edit-secret": process.env.V0_EDIT_SECRET!,
      "Content-Type": "application/json",
    },
  })

  if (response.ok) {
    return await response.json()
  }

  return null
}
