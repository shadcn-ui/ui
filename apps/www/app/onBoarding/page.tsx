"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useFormState } from "react-dom"

import InputDisabled from "@/registry/default/example/input-disabled"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Separator } from "@/registry/new-york/ui/separator"

import { ProfileForm } from "../examples/forms/profile-form"
import { submitOnboarding } from "../lib/actions"
import { SubmitButton } from "../sharedComponents/submitButton"
import { applicationName } from "../sharedLabels"
import { ActionResult } from "../sharedTypes"

export default function OnBoarding() {
  const searchParams = useSearchParams()
  const onBoardingId = searchParams?.get("onBoardingId")
  const [result, action] = useFormState<ActionResult | undefined, FormData>(
    submitOnboarding,
    undefined
  )

  const [email, setEmail] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [appUrl, setAppUrl] = useState<string>("")

  useEffect(() => {
    fetch(`/api?onBoardingId=${onBoardingId}`)
      .then((res) => res.json())
      .then((data) => {
        setEmail(data.email)
        setStatus(data.status)
      })

    fetch(`/api/appUrl`)
      .then((res) => res.json())
      .then((data) => {
        setAppUrl(data.appUrl)
      })
  })

  return (
    <div className="space-y-0.5 p-10">
      <h2 className="text-2xl font-bold tracking-tight">Onboarding</h2>
      {status !== "active" && (
        <p className="text-muted-foreground">
          Please complete some basic information about yourself before starting
          to use {applicationName}
        </p>
      )}
      {status === "active" && (
        <p className="text-muted-foreground">
          Your onboarding is now completed, you can now connect to{" "}
          <a href={appUrl} className="font-bold">
            {applicationName}
          </a>
        </p>
      )}

      <Separator />
      {status !== "active" && (
        <div className="flex">
          <div className="flex-1">
            <form action={action} className="mt-6 space-y-6">
              <input type="hidden" name="email" value={email!} />
              <div>
                <Label>Email</Label>
                <Input value={email} disabled={true} />
                <p className="text-[0.8rem] text-muted-foreground">
                  This is your account email, and cannot be changed.
                </p>
              </div>
              <div>
                <Label>First name</Label>
                <Input name="firstName" />
              </div>
              <div>
                <Label>Last name</Label>
                <Input name="lastName" />
              </div>
              <div>
                <Select name="currency">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select your currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Currency</SelectLabel>
                      <SelectItem value="euro">euro</SelectItem>
                      <SelectItem value="dollar">dollar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-[0.8rem] text-muted-foreground">
                  Select the currency in which you want to manage your
                  transactions.
                </p>
              </div>
              <SubmitButton></SubmitButton>
            </form>
          </div>
          <div className="flex-1"></div>
        </div>
      )}
    </div>
  )
}

// recuperer l'id external de l'url
// chercher le mail et le mettre en InputDisabled
// 3 champs firsntmae lastname currency sauvegarder
// proposer de se reconnecter après
