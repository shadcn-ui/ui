import type {
  IconName,
  IconPrefix,
  IconStyle,
} from "@fortawesome/fontawesome-svg-core";
import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
// TODO: pnpm i -w [the following libs]
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import { fas } from "@fortawesome/pro-solid-svg-icons";
import { fat } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas, fal, fab, fad, far, fat);



export type IconType = `${IconName}-${IconStyle}`;

type Props = {
  name: IconType;
  className?:string
};

const FontAwesome = ({ name,className, ...props }: Props) => {
  const perfixList: { name: IconStyle; value: IconPrefix }[] = [
    { name: "solid", value: "fas" },
    { name: "regular", value: "far" },
    { name: "light", value: "fal" },
    { name: "duotone", value: "fad" },
    { name: "brands", value: "fab" },
    { name: "thin", value: "fat" },
  ];
  const [icon, style] = name?.split("-") as [IconName, IconStyle];
  const iconPrefix: IconPrefix | undefined =
    perfixList.find(obj => obj.name === style)?.value || "fas";
  const findIcon = findIconDefinition({ iconName: icon, prefix: iconPrefix });
  return <FontAwesomeIcon icon={findIcon} {...props} />;
};

export default FontAwesome;
