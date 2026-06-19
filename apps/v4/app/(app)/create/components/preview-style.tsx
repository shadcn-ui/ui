"use client"

export function PreviewStyle() {
  return (
    <style jsx global>{`
      html {
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    `}</style>
  )
}
