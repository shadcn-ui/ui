import * as React from "react"

type WelcomeEmailProps = {
  title: string
  content: string
  url: string
}

export default function WelcomeEmail({
  url,
  title,
  content,
}: Readonly<WelcomeEmailProps>) {
  return (
    <div>
      <h1 className="text-xl text-teal-900">{title}</h1>
      <p className="text-black">{content}</p>
      <a href={url}>Click here to start</a>
    </div>
  )
}
