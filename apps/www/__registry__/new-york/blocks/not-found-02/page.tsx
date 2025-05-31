import { NotFound } from "@/registry/new-york/blocks/not-found-02/components/not-found"

export default function Page() {
  return (
    <div className="flex flex-col xl:grid min-h-svh xl:grid-cols-[max(50%,36rem),1fr] gap-y-16 xl:gap-0 p-6 pt-16 xl:p-0">
      <div className="flex flex-col items-center justify-center">
        <NotFound />
      </div>
      <div className="relative bg-muted h-96 xl:h-full mx-auto w-full max-w-3xl xl:max-w-full">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
