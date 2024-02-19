"use server"

import { signIn as signInAuth, signUp as signUpAuth } from "@/auth"
import { Currency, PrismaClient, Status } from "@prisma/client"
import { sql } from "@vercel/postgres"
import { AuthError } from "next-auth"
import nodemailer from "nodemailer"

import { ActionResult } from "../sharedTypes"

const prisma = new PrismaClient()

export async function signIn(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  console.log("signin")
  console.log(formData)
  try {
    await signInAuth("credentials", {
      redirect: true,
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: formData.get("callbackUrl")?.toString(),
    })
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
    const onBoardingId = await signUpAuth(formData)
    console.log("returned onboarding", onBoardingId)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    })
    console.log("transporter created")
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: formData.get("email")!.toString(),
      subject: "Confirm your email address",
      text: `please click on the following link to confirm your email address : ${process.env.APP_URL}onBoarding?onBoardingId=${onBoardingId}`,
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
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
  console.log(formData)
  return Promise.resolve({ successMessage: "" })
}

export async function submitOnboarding(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  const email = formData.get("email")!.toString()
  const currency = formData.get("currency")!.toString()
  const lastName = formData.get("lastName")!.toString()
  const firstName = formData.get("firstName")!.toString()

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      currency: currency as Currency,
      lastName,
      firstName,
      status: Status.active,
    },
  })

  return Promise.resolve({ successMessage: "" })
}
