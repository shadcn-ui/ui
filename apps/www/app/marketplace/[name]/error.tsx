"use client"

export default function Error({ error, }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ lineHeight: "48px", margin: "auto" }}>
      <h1
        className="next-error-h1"
        style={{
            borderRight:"1px solid white",
          display: "inline-block",
          margin: "0 20px 0 0",
          paddingRight: "23px",
          fontSize: "24px",
          fontWeight: 500,
          verticalAlign: "top",
        }}
      >
        404
      </h1>
      <div style={{ display: "inline-block" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 400, lineHeight: "28px" }}>
          This component is not found
        </h2>
      </div>
    </div>
  )
}
