import type { ComponentProps } from "react";
import FontAwesome from "./helper/fontAwesomeIcon";
import type { IconType } from './helper/fontAwesomeIcon'

type MyDivProps = ComponentProps<typeof FontAwesome>;
const Icon = (props: MyDivProps) => {
  return <FontAwesome {...props} />;
};



export { IconType, Icon };
