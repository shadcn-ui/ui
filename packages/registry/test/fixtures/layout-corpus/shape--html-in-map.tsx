import "./globals.css"

export default function L({ children }) {
  return (
    <>
      {[1].map((i) => (
        <html key={i} lang="en" className={cn(
          "a",
          "b"
        )}>
          <body>{children}</body>
        </html>
      ))}
    </>
  )
}
