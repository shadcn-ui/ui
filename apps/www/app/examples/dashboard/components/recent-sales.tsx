import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://notion-avatar.vercel.app/api/img/eyJmYWNlIjoxMCwibm9zZSI6MTAsIm1vdXRoIjo5LCJleWVzIjo3LCJleWVicm93cyI6MTIsImdsYXNzZXMiOjcsImhhaXIiOjU1LCJhY2Nlc3NvcmllcyI6MCwiZGV0YWlscyI6MCwiYmVhcmQiOjAsImZsaXAiOjAsImNvbG9yIjoiI2ViZWJlYiIsInNoYXBlIjoiY2lyY2xlIn0=" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            olivia.martin@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="https://notion-avatar.vercel.app/api/img/eyJmYWNlIjoxMiwibm9zZSI6MywibW91dGgiOjksImV5ZXMiOjQsImV5ZWJyb3dzIjo0LCJnbGFzc2VzIjoxMCwiaGFpciI6NDMsImFjY2Vzc29yaWVzIjowLCJkZXRhaWxzIjowLCJiZWFyZCI6MCwiZmxpcCI6MCwiY29sb3IiOiIjZWJlYmViIiwic2hhcGUiOiJjaXJjbGUifQ==" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Lee</p>
          <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://notion-avatar.vercel.app/api/img/eyJmYWNlIjowLCJub3NlIjoxMSwibW91dGgiOjE2LCJleWVzIjoxLCJleWVicm93cyI6MTAsImdsYXNzZXMiOjAsImhhaXIiOjU4LCJhY2Nlc3NvcmllcyI6MCwiZGV0YWlscyI6MCwiYmVhcmQiOjAsImZsaXAiOjAsImNvbG9yIjoiI2ViZWJlYiIsInNoYXBlIjoiY2lyY2xlIn0=" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
          <p className="text-sm text-muted-foreground">
            isabella.nguyen@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://notion-avatar.vercel.app/api/img/eyJmYWNlIjoxLCJub3NlIjo3LCJtb3V0aCI6OSwiZXllcyI6MiwiZXllYnJvd3MiOjgsImdsYXNzZXMiOjIsImhhaXIiOjksImFjY2Vzc29yaWVzIjowLCJkZXRhaWxzIjowLCJiZWFyZCI6MCwiZmxpcCI6MCwiY29sb3IiOiIjZWJlYmViIiwic2hhcGUiOiJjaXJjbGUifQ==" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-sm text-muted-foreground">will@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://notion-avatar.vercel.app/api/img/eyJmYWNlIjozLCJub3NlIjo4LCJtb3V0aCI6MTEsImV5ZXMiOjgsImV5ZWJyb3dzIjo2LCJnbGFzc2VzIjoxNCwiaGFpciI6MjUsImFjY2Vzc29yaWVzIjowLCJkZXRhaWxzIjowLCJiZWFyZCI6MCwiZmxpcCI6MCwiY29sb3IiOiIjZWJlYmViIiwic2hhcGUiOiJjaXJjbGUifQ==" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sofia Davis</p>
          <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
    </div>
  )
}
