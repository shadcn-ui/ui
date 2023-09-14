import type { ComponentProps } from "react";
import FontAwesome from "./helper/fontAwesomeIcon";

type MyDivProps = ComponentProps<typeof FontAwesome>;
const Icons = (props: MyDivProps) => {
  return <FontAwesome {...props} />;
};

export default Icons;
