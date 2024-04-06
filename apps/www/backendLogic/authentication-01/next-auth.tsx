export async function handleSubmit(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  console.log(email, password)
  console.log("next-auth code being run")
}
