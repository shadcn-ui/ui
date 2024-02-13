"use server"

import { signIn as signInAuth, signUp as signUpAuth } from "@/auth"
import { AuthError } from "next-auth"

import { ActionResult } from "../sharedTypes"

export async function signIn(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    await signInAuth("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { errorMessage: "Invalid credentials" }
      }
      return { errorMessage: "Something went wrong" }
    }
    throw error
  }
}

export async function signUp(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    await signUpAuth(formData)
  } catch (error) {
    return { errorMessage: "User already exists" }
  }
  return {
    successMessage: "Check your emails to finalise your account creation",
  }
}

export async function requestResetPasswordEmail(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  return Promise.resolve({ successMessage: "" })
}
