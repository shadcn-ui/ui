import { Twitter } from "lucide-react"

import CryptoCard from "@/registry/default/ui/crypto-card"

export default function CryptoCardDemo() {
  return (
    <CryptoCard>
      <span className="z-20 text-3xl font-bold text-black dark:text-white">
        <Twitter size={88} className="text-indigo-500" />
      </span>
    </CryptoCard>
  )
}
