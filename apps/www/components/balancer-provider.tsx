import { Provider } from "react-wrap-balancer"

type ProviderProps = React.ComponentProps<typeof Provider>

export function WrapBalancerProvider(props: ProviderProps) {
  return <Provider {...props} />
}
