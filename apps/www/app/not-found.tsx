export default async function NotFound() {
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center justify-center">
        <h2 className="mr-6 pr-6 text-2xl font-semibold align-top leading-49 text-primary border-r border-solid border-muted-foreground">
          404
        </h2>
        <p className="text-primary font-normal leading-49 m-0">
          This page could not be found.
        </p>
      </div>
    </main>
  )
}
