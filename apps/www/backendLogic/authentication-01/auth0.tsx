export async function handleSubmit(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  console.log(email, password)
  console.log("auth0 code being run")
}
