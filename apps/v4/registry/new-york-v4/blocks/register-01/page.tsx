import React from "react"

import { RegistrationForm } from "@/registry/new-york-v4/blocks/register-01/components/user-registration-form"

const page = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <RegistrationForm />
      </div>
    </div>
  )
}

export default page
