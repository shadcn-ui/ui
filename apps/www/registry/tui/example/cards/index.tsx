import { CardsActivityGoal } from "@/registry/tui/example/cards/activity-goal";
import { CardsCalendar } from "@/registry/tui/example/cards/calendar";
import { CardsChat } from "@/registry/tui/example/cards/chat";
import { CardsComboBox } from "@/registry/tui/example/cards/combo-box";
import { CardsCookieSettings } from "@/registry/tui/example/cards/cookie-settings";
import { CardsCreateAccount } from "@/registry/tui/example/cards/create-account";
import { CardsDataTable } from "@/registry/tui/example/cards/data-table";
import { DropdownMenuCard } from "@/registry/tui/example/cards/dropdown-card";
import { CardsMetric } from "@/registry/tui/example/cards/metric";
import { CardsPaymentMethod } from "@/registry/tui/example/cards/payment-method";
import { CardsReportIssue } from "@/registry/tui/example/cards/report-issue";
import { SelectMenu } from "@/registry/tui/example/cards/select-menucard";
import { CardsShare } from "@/registry/tui/example/cards/share";
import { CardsStats } from "@/registry/tui/example/cards/stats";
import { CardsTeamMembers } from "@/registry/tui/example/cards/team-members";
import { CardsAvatar } from "./avatar";
import { CardsBadge } from "./badge";
import { CardsButton } from "./button";
import CheckboxesCard from "./checkboxesCard";
import PrimitiveToggleCards from "./primitiveToggleCards";
import RadioCard from "./radioGroupsCard";
import SwitchCard from "./switchCard";
import DialogCard from "./dialogCard";
import { CardsInputGroup } from "./inputgroup";


export default function CardsDemo() {
  return (
    <div className="md:grid-cols-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4">
      <div className="col-span-12 space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <CardsInputGroup/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DropdownMenuCard />
          <CardsAvatar />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CardsBadge />
          <CardsButton />
        </div>
      </div>
      <div className="space-y-4 lg:col-span-4 xl:col-span-6 xl:space-y-4">
        <CardsComboBox />
        <SelectMenu />
        <CardsStats />
        <div className="grid gap-1 sm:grid-cols-[280px_1fr] md:hidden">
          <CardsCalendar />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CardsBadge />
            <CardsButton />
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-6 xl:col-span-5 xl:space-y-4">
        <div className="col-span-2">
          <SwitchCard />
        </div>
        <div className="md:col-span-6 col-span-12 mt-2">
          <PrimitiveToggleCards />
        </div>
        <div className="col-span-12">
          <RadioCard />
        </div>
        <div className="md:col-span-6 col-span-12">
          <CheckboxesCard />
        </div>
        <div className="md:col-span-6 col-span-12">
          <DialogCard />
        </div>
      </div>

      <div className="space-y-4 lg:col-span-4 xl:col-span-6 xl:space-y-4">
        <CardsStats />
        <div className="grid gap-1 sm:grid-cols-[280px_1fr] md:hidden">
          <CardsCalendar />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-4">
            <CardsMetric />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-4 xl:space-y-4">
            <CardsTeamMembers />
            <CardsCookieSettings />
            <CardsPaymentMethod />
          </div>
          <div className="space-y-4 xl:space-y-4">
            <CardsChat />
            <CardsCreateAccount />
            <div className="hidden xl:block">
              <CardsReportIssue />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-6 xl:col-span-5 xl:space-y-4">
        <div className="hidden gap-1 sm:grid-cols-[280px_1fr] md:grid">
          <CardsCalendar />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-3">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-3">
            <CardsMetric />
          </div>
        </div>
        <div className="hidden md:block">
          <CardsDataTable />
        </div>
        <CardsShare />
        <div className="xl:hidden">
          <CardsReportIssue />
        </div>
      </div>
    </div>
  );
}
