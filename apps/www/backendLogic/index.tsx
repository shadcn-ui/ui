import { handleSubmit as auth0HandleSubmit } from "@/backendLogic/authentication-01/auth0"
import { handleSubmit as nextAuthHandleSubmit } from "@/backendLogic/authentication-01/next-auth"
import { handleSubmit as supabaseHandleSubmit } from "@/backendLogic/authentication-01/supabase"

import { BackendProvider } from "@/registry/backend-provider"

export async function authenticationHandler(
  name: string,
  formData: FormData,
  backendProvider: BackendProvider["name"]
) {
  switch (name) {
    case "authentication-01":
      switch (backendProvider) {
        case "next-auth":
          await nextAuthHandleSubmit(formData)
          break

        case "supabase":
          await supabaseHandleSubmit(formData)
          break

        case "auth0":
          await auth0HandleSubmit(formData)
          break
        default:
          break
      }

    default:
      break
  }
}
