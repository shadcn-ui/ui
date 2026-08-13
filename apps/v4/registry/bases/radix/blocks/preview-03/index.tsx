import { FilesChat } from "@/registry/bases/radix/blocks/preview-03/cards/files-chat"
import { GroupChat } from "@/registry/bases/radix/blocks/preview-03/cards/group-chat"
import { ReasoningChat } from "@/registry/bases/radix/blocks/preview-03/cards/reasoning-chat"
import { SimpleChat } from "@/registry/bases/radix/blocks/preview-03/cards/simple-chat"
import { Spinner } from "@/registry/bases/radix/ui/spinner"

export default function Preview03Example() {
  return (
    <div className="flex h-screen min-h-0 flex-col overflow-x-auto overflow-y-hidden bg-muted contain-[paint] [--gap:--spacing(4)] 3xl:[--gap:--spacing(12)] md:[--gap:--spacing(10)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)]">
      <div className="flex min-h-0 w-full min-w-max flex-1 justify-center">
        <div
          className="grid min-h-0 w-[2400px] grid-cols-7 items-start gap-(--gap) bg-muted p-(--gap) md:w-[3000px] dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] *:[div]:gap-(--gap)"
          data-slot="capture-target"
        >
          <div className="flex h-full min-h-0 flex-1 flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <SimpleChat />
          </div>
          <div className="flex h-full min-h-0 flex-1 flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <GroupChat />
          </div>
          <div className="flex h-full min-h-0 flex-1 flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <ReasoningChat />
          </div>
          <div className="flex h-full min-h-0 flex-1 flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <FilesChat />
          </div>
        </div>
      </div>
      <div className="sr-only">
        <Spinner />
      </div>
    </div>
  )
}
