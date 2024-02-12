import Link from "next/link";
import { applicationName } from "../sharedLabels";

interface GeneralConditionsProps {
    callToAction:string
}

export function GeneralConditions({callToAction}:GeneralConditionsProps){
    return (<p className="px-8 text-center text-sm text-muted-foreground">
    By clicking on {callToAction}, you agree to{" "}
    <Link
      href="/terms"
      className="underline underline-offset-4 hover:text-primary"
    >
      User Agreement
    </Link>{" "}
    , {" "}
    <Link
      href="/privacy"
      className="underline underline-offset-4 hover:text-primary"
    >
      Privacy Policy
    </Link>
    , and {" "}
    <Link
      href="/privacy"
      className="underline underline-offset-4 hover:text-primary"
    >
      Cookie Policy{" "}
    </Link>
    of {applicationName}.
  </p>)
}