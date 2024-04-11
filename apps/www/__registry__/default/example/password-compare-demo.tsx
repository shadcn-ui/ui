import React, { FormEvent, useState } from "react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PasswordCompare } from "../ui/password-compare"

export default function PasswordCompareDemo() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  })
  const [pwdValid, setPwdValid] = useState<boolean>(false)
  const formValid = formValues.email && formValues.password && pwdValid

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formValues)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-balance text-muted-foreground">
          Fill all the fields below to create an account
        </p>
      </div>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
        className="grid gap-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={formValues.email}
            onChange={handleChange}
            id="email"
            name="email"
            type="email"
            placeholder="simon@example.com"
          />
        </div>
        <PasswordCompare
          onChange={(pwd: string) => {
            setFormValues({ ...formValues, password: pwd })
          }}
          onValidChange={(valid: boolean) => {
            setPwdValid(valid)
          }}
        />
        <Button disabled={!formValid} type="submit" className="w-full">
          Sign up
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already registered?{" "}
        <a href="/login" className="underline">
          Sign in
        </a>
      </div>
    </div>
  )
}