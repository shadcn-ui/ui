import React from "react"

export default function Ring() {
  return (
    <div className="flex h-[500px] w-full items-center justify-center bg-gradient-to-b from-indigo-800 to-indigo-950">
      <div
        className="animate-rotate absolute mx-auto my-0 h-[300px] w-[300px] rounded-full"
        style={{
          left: "calc(50% - 150px)",
          backgroundImage:
            "linear-gradient(135deg, #FEED07 0%, #FE6A50 5%, #ED00AA 15%, #2FE3FE 50%, #8900FF 100%)",
        }}
      ></div>
      <div
        className="absolute mx-auto my-0 h-[280px] w-[280px] rounded-full bg-gradient-to-b from-indigo-800 to-indigo-950"
        style={{
          left: "calc(50% - 140px)",
        }}
      ></div>
    </div>
  )
}
