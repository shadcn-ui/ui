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
import FlyoutMenu from "@/components/flyoutMenu";
import TabsCard from "@/components/tabsCard";
import DividerCard from "./dividerCard";
import BannerCards from "./bannerCards";
import Navbars from "@/components/navbars";
import { CardsInputGroup } from "./inputgroup";
import { CardsButtonGroup } from "./button-group";
import { CardsTextArea } from "./text-area";
import { CardsSidebarNavigation } from "./sidebar-navigation";
import { VerticalNavigationCard } from "./vertical-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { SlideOverCard } from "./slideover-card";
import { HeaderCard } from "./header-card";
import { CardsPagination } from "./pagination";
import { CardsCommandPalettes } from "./command-palettes";


export default function CardsDemo() {
  return (
    <>
      <div className="w-full">
        <Tabs defaultValue="df-components">
          <TabsList variant={"underline"} >
            <TabsTrigger
              variant={"underline"}
              value="df-components"
              icon={"user-solid"}
            >
              Default
            </TabsTrigger>
            <TabsTrigger
              variant={"underline"}
              value="ss-components"
              icon={"user-solid"}
            >
              Shubhendu
            </TabsTrigger>
            <TabsTrigger
              variant={"underline"}
              value="rs-components"
              icon={"user-solid"}
            >
              Raghav
            </TabsTrigger>
            <TabsTrigger
              variant={"underline"}
              value="kp-components"
              icon={"user-solid"}
            >
              Kaushal
            </TabsTrigger>
            <TabsTrigger
              variant={"underline"}
              value="pg-components"
              icon={"user-solid"}
            >
              Parag
            </TabsTrigger>
          </TabsList>
          <TabsContent value="df-components">
            <div className="md:grid-cols-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4">
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
          </TabsContent>

          <TabsContent value="ss-components" className="flex flex-col space-y-5">
            <div className="grid-cols-2 grid gap-4">
              <DropdownMenuCard />
              <SelectMenu />
            </div>
            <div className="grid-cols-2 grid gap-4">
              <CardsComboBox />
              <SlideOverCard />
            </div>
            <div className="grid-cols-3 grid gap-4">
              <VerticalNavigationCard />
            </div>
            <HeaderCard />
          </TabsContent>

          <TabsContent value="rs-components" className="flex flex-col space-y-5">
            <div className="grid-cols-1 grid gap-4">
              <BannerCards />
            </div>
            <div className="grid-cols-2 grid gap-4">
              <CheckboxesCard />
              <SwitchCard />
            </div>
            <div className="grid-cols-2 grid gap-4">
              <RadioCard />
              <DialogCard />
            </div>
            <div className="grid-cols-2 grid gap-4">
              <TabsCard />
              <DividerCard />
            </div>
            <div className="grid-cols-1 grid gap-4">
              <FlyoutMenu />
              <DividerCard />
            </div>
          </TabsContent>

          <TabsContent value="kp-components" className="flex flex-col space-y-5">
            <div className="grid-cols-1 grid gap-4">
              <Navbars />
            </div>
            <div className="grid-cols-2 grid gap-4">
              <CardsAvatar />
              <CardsButton />

            </div>
            <div className="grid-cols-1 grid gap-4">
              <CardsBadge />
            </div>
          </TabsContent>

          <TabsContent value="pg-components" className="flex flex-col space-y-5">

            <CardsPagination />
            <div className="grid-cols-2 grid gap-4">
              <CardsCommandPalettes />
            </div>

            <div className="grid-cols-2 grid gap-4">
              <CardsInputGroup />
              <CardsTextArea />
            </div>
            <div className="grid-cols-2 grid gap-4">
              <CardsButtonGroup />
              <CardsSidebarNavigation />
            </div>
          </TabsContent>
        </Tabs >
      </div>
      {/* <div className="grid md:grid-cols-2 md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4">
        <div className="space-y-4 lg:col-span-12 xl:col-span-12 xl:space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CardsButtonGroup />
            <CardsTextArea />
            <CardsInputGroup />
            <CardsSidebarNavigation />
          </div>
          <Navbars />
        </div>
        <div className="col-span-12 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CardsInputGroup />
            <CardsButtonGroup />
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
          <VerticalNavigationCard />
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
        <div className="space-y-4 lg:col-span-12 xl:col-span-12 xl:space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SwitchCard />
            <PrimitiveToggleCards />
            <RadioCard />
            <CheckboxesCard />
            <DialogCard />
            <DividerCard />
            <TabsCard />
            <BannerCards />
            <FlyoutMenu />
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
      </div> */}
    </>
  );
}
