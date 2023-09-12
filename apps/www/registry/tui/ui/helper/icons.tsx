import {
  IconName,
  IconPrefix,
  IconStyle,
  library,
} from "@fortawesome/fontawesome-svg-core"
// TODO: pnpm i -w [the following libs]
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fad } from "@fortawesome/pro-duotone-svg-icons"
import { fal } from "@fortawesome/pro-light-svg-icons"
import { far } from "@fortawesome/pro-regular-svg-icons"
import { fas } from "@fortawesome/pro-solid-svg-icons"
import { fat } from "@fortawesome/pro-thin-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
library.add(fas, fal, fab, fad, far, fat)

export type IconsType = `${IconName}-${IconStyle}`;

export const icons = (icons?: IconsType) => {
  const perfixList: { name: IconStyle; value: IconPrefix }[] = [
    { name: "solid", value: "fas" },
    { name: "regular", value: "far" },
    { name: "light", value: "fal" },
    { name: "duotone", value: "fad" },
    { name: "brands", value: "fab" },
    { name: "thin", value: "fat" },
  ]

  if (icons) {
    const [icon, style] = icons?.split('-') as [IconName, IconStyle];
    const iconPrefix: IconPrefix | undefined =
      perfixList.find((obj) => obj.name === style)?.value || "fas"
    return icon ? <FontAwesomeIcon icon={[iconPrefix, icon]} /> : null
  } else {
    return null
  }
}
