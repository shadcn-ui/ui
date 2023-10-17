import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Steps } from "../../ui/steps";
import { useMemo } from "react";

export const CardsSteps = ()=> {
    const steps = useMemo(() => [
        { id: "Step 1", name: "Job details", borderClass: "border-indigo-600", textClass: "text-indigo-600",status: 'complete' },
        { id: "Step 2", name: "Application form", borderClass: "border-indigo-600", textClass: "text-indigo-600", status: 'current' },
        { id: "Step 3", name: "Preview", borderClass: "border-gray-200", textClass: "text-gray-500", status: 'upcoming' }
      ], []);

    const stepsData = useMemo(() => [
      { name: 'Step 1', href: '#', status: 'complete' },
      { name: 'Step 2', href: '#', status: 'current' },
      { name: 'Step 3', href: '#', status: 'upcoming' },
      { name: 'Step 4', href: '#', status: 'upcoming' },
    ], []);

    const stepsList = useMemo(() => [
      { name: 'Step 1', href: '#', status: 'complete' },
      { name: 'Step 2', href: '#', status: 'complete' },
      { name: 'Step 3', href: '#', status: 'complete' },
      { name: 'Step 4', href: '#', status: 'current' },
      { name: 'Step 5', href: '#', status: 'upcoming' },
    ], []);

      const stepsListItem = useMemo(() =>[
        { name: 'Create account', href: '#', status: 'complete' },
        { name: 'Profile information', href: '#', status: 'current' },
        { name: 'Theme', href: '#', status: 'upcoming' },
        { name: 'Preview', href: '#', status: 'upcoming' },
      ], []);
      const stepsDataItem = useMemo(() =>[
        { name: 'Create account', description: 'Vitae sed mi luctus laoreet.', href: '#', status: 'complete' },
        {
          name: 'Profile information',
          description: 'Cursus semper viverra facilisis et et some more.',
          href: '#',
          status: 'current',
        },
        { name: 'Business information', description: 'Penatibus eu quis ante.', href: '#', status: 'upcoming' },
        { name: 'Theme', description: 'Faucibus nec enim leo et.', href: '#', status: 'upcoming' },
        { name: 'Preview', description: 'Iusto et officia maiores porro ad non quas.', href: '#', status: 'upcoming' },
      ], []);
      const stepsText = useMemo(() => [
        { text: "Copying files", align: "left", color: "indigo-600" },
        { text: "Migrating database", align: "center", color: "indigo-600" },
        { text: "Compiling assets", align: "center", color: null },
        { text: "Deployed", align: "right", color: null }
      ], []);

      const stepsItem =  useMemo(() => [
        { id: '01', name: 'Job details', href: '#', status: 'complete' },
        { id: '02', name: 'Application form', href: '#', status: 'current' },
        { id: '03', name: 'Preview', href: '#', status: 'upcoming' },
      ], []);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
              <div className=" font-bold text-primary pb-5">Simple</div>
                <Steps steps={steps} simple={true} borderColor="indigo" />

                <div className="font-bold text-primary pb-5">Panels</div>
                <Steps steps={stepsItem} panels={true}  backgroundColor="indigo" divSize="xl" icon="check-duotone"  textColor="indigo" borderColor="indigo"/>

                <div className="font-bold text-primary pb-5">Bullets</div>
                <Steps steps={stepsData} bullets={true} backgroundColor="indigo" spanSize="default" bulletStepText="Step" bulletOfText="of" anchorSize="xl" textColor="indigo" borderColor="indigo" />

                <div className="font-bold text-primary pb-5">Circle</div>
                <Steps steps={stepsList} circle={true} backgroundColor="indigo" icon="check-duotone" borderColor="indigo" />

                <div className="font-bold text-primary pb-5">Bullets and Text</div>
                <Steps steps={stepsListItem} bulletText={true} backgroundColor="indigo" icon="check-duotone" iconStyle="group-hover:text-indigo-800" spanSize="m" divSize="l" textColor="indigo" />

                <div className="text-m mt-14 font-bold text-primary pb-5">Circles with text</div>
                <Steps steps={stepsDataItem} circleText={true} textColor="gray" backgroundColor="indigo" divSize="m" icon="check-duotone" borderColor="indigo" />

                <div className="text-m mt-14 font-bold text-primary pb-5">Progress bar</div>
                <Steps steps={stepsText} progressBar={true} backgroundColor="indigo" divSize="l"  />
              </div>
               

            </CardContent>
        </Card>
    )
}