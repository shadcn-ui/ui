import { createClient } from "@supabase/supabase-js"

export async function handleSubmit(formData: FormData) {
  "use server"

  const email = formData.get("email")
  const password = formData.get("password")

  const supabase = createClient(
    "https://bxmouifhdlbpqfjplwhs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4bW91aWZoZGxicHFmanBsd2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNjk0MDEsImV4cCI6MjAyNjk0NTQwMX0.luObOkUe4SWJ-oc-qjVxLYY_f77G0h0GG4vBqlo_4rM"
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    console.error("error", error)
    return
  }

  console.log(email, password)
  console.log("supabase code being run")
}
