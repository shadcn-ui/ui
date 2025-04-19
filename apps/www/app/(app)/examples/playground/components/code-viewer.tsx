import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"

export function CodeViewer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">View code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>View code</DialogTitle>
          <DialogDescription>
            You can use the following code to start integrating your current
            prompt and settings into your application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-md bg-black p-6">
            <pre>
              <code className="grid gap-1 text-sm text-muted-foreground [&_span]:h-4">
                <span>
                  <span className="text-sky-300">import</span> os
                </span>
                <span>
                  <span className="text-sky-300">import</span> openai
                </span>
                <span />
                <span>
                  openai.api_key = os.getenv(
                  <span className="text-green-300">
                    &quot;OPENAI_API_KEY&quot;
                  </span>
                  )
                </span>
                <span />
                <span>response = openai.Completion.create(</span>
                <span>
                  {" "}
                  model=
                  <span className="text-green-300">&quot;davinci&quot;</span>,
                </span>
                <span>
                  {" "}
                  prompt=<span className="text-amber-300">&quot;&quot;</span>,
                </span>
                <span>
                  {" "}
                  temperature=<span className="text-amber-300">0.9</span>,
                </span>
                <span>
                  {" "}
                  max_tokens=<span className="text-amber-300">5</span>,
                </span>
                <span>
                  {" "}
                  top_p=<span className="text-amber-300">1</span>,
                </span>
                <span>
                  {" "}
                  frequency_penalty=<span className="text-amber-300">0</span>,
                </span>
                <span>
                  {" "}
                  presence_penalty=<span className="text-green-300">0</span>,
                </span>
                <span>)</span>
              </code>
            </pre>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Your API Key can be found here. You should use environment
              variables or a secret management tool to expose your key to your
              applications.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function renderThemeCSS() {
  return `
    @layer base {
      :root {
        --background: 0.967 0.005 0;
        --foreground: 0.12 0.011 20.3;
        --card: 0.967 0.005 0;
        --card-foreground: 0.12 0.011 20.3;
        --popover: 0.967 0.005 0;
        --popover-foreground: 0.12 0.011 20.3;
        --primary: 0.651 0.236 47.9;
        --primary-foreground: 0.98 0.008 26;
        --secondary: 0.76 0.126 60;
        --secondary-foreground: 0.165 0.036 24;
        --muted: 0.76 0.126 60;
        --muted-foreground: 0.47 0.057 25;
        --accent: 0.76 0.126 60;
        --accent-foreground: 0.165 0.036 24;
        --destructive: 0.37 0.196 0;
        --destructive-foreground: 0.968 0.031 60;
      }
    }
  `
}
