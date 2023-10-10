import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Notifications } from "../../ui/notification"


export function CardsNotification() {
    function handleButtonClick() {
       
    }
    const imageSrc = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Navigations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-m font-bold text-primary">Simple</div>
                <Notifications icon="circle-check-regular" closeIcon="xmark-regular" hasNoButton={true} iconStyle="h-6 w-6 text-green-400" titleText="Successfully saved!" descriptionText="Anyone with a link can now view this file." textColor="gray" alignment="topRightCorner" oncloseButtonClick={handleButtonClick} />

                <div className="text-m font-bold text-primary">Condensed</div>
                <Notifications parallelCrossButton={true} closeIcon="xmark-regular" titleText="Discussion archived" buttonNameText="Undo" textColor="indigo" oncloseButtonClick={handleButtonClick} alignment="topRightCorner" onButtonClick={handleButtonClick} />

                <div className="text-m font-bold text-primary">With actions below</div>
                <Notifications titleText="Discussion moved" closeIcon="xmark-regular" icon="inbox-regular" buttonNameText="Undo" dismissButtonNameText="Dismiss" descriptionText="Anyone with a link can now view this file." textColor="indigo" alignment="topRightCorner" hasDualButton={true} onFirstButtonClick={handleButtonClick} onSecondButtonClick={handleButtonClick} oncloseButtonClick={handleButtonClick} />

                <div className="text-m font-bold text- primary">With avatar</div>
                <Notifications imageSrc={imageSrc} imageStyle="h-10 w-10 rounded-full" hasReplyButton={true} hasNoButton={true} titleText="Emilia Gates" descriptionText="Sure! 8:30pm works great!" replyButtonText="Replay" textColor="indigo" alignment="topRightCorner" onButtonClick={handleButtonClick} />

                <div className="text-m font-bold text-primary">With split buttons</div>
                <Notifications titleText="Receive notifications" descriptionText="Notifications may include alerts, sounds, and badges." replyButtonText="Replay" allowButtonText="Don't allow" textColor="indigo" hasNoButton={true} alignment="topRightCorner" onButtonClick={handleButtonClick} />

                <div className="text-m font-bold text-primary">With buttons below   </div>
                <Notifications imageSrc={imageSrc} closeIcon="xmark-regular" imageStyle="h-10 w-10 rounded-full" titleText="Emilia Gates" descriptionText="Sent you an invite to connect." declineButtonText="Decline" acceptButtonText="Accept"  textColor="slate" backgroundColor="indigo" alignment="topRightCorner" onAcceptButtonClick={handleButtonClick} onDeclineButtonClick={handleButtonClick} oncloseButtonClick={handleButtonClick} />
            </CardContent>
        </Card>
    )
}


