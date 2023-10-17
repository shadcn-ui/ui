import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Notifications } from "../../ui/notification"
import profilePic from '../../assest/profilePic.webp';


export const CardsNotification = () => {
    function handleButtonClick() {

    }
    const profileImageUrl = profilePic.src;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Navigations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-5">

                    <div className="font-bold text-primary">Simple</div>
                    <Notifications icon="circle-check-regular" closeIcon="xmark-regular" closeIconStyle="text-gray-400 hover:text-gray-500" hasNoButton={true} iconStyle="h-6 w-6 text-green-400" titleText="Successfully saved!" descriptionText="Anyone with a link can now view this file." textColor="gray" alignment="topRightCorner" oncloseButtonClick={handleButtonClick} />

                    <div className="font-bold text-primary">Condensed</div>
                    <Notifications parallelCrossButton={true} closeIcon="xmark-regular" closeIconStyle="text-gray-400 hover:text-gray-500" titleText="Discussion archived" buttonNameText="Undo" textColor="indigo" oncloseButtonClick={handleButtonClick} alignment="topRightCorner" onButtonClick={handleButtonClick} />

                    <div className="font-bold text-primary">With actions below</div>
                    <Notifications titleText="Discussion moved" closeIcon="xmark-regular" closeIconStyle="text-gray-400 hover:text-gray-500" icon="inbox-regular" iconStyle="h-5 w-5 text-gray-400" buttonNameText="Undo" dismissButtonNameText="Dismiss" descriptionText="Lorem ipsum dolor sit amet consectetur adipisicing elit oluptatum tenetur." textColor="indigo" alignment="topRightCorner" hasDualButton={true} onFirstButtonClick={handleButtonClick} onSecondButtonClick={handleButtonClick} oncloseButtonClick={handleButtonClick} />

                    <div className="font-bold text- primary">With avatar</div>
                    <Notifications imageSrc={profileImageUrl} imageStyle="h-10 w-10 rounded-full" hasReplyButton={true} hasNoButton={true} titleText="Emilia Gates" descriptionText="Sure! 8:30pm works great!" replyButtonText="Replay" textColor="indigo" alignment="topRightCorner" onButtonClick={handleButtonClick} />

                    <div className="font-bold text-primary">With split buttons</div>
                    <Notifications titleText="Receive notifications" descriptionText="Notifications may include alerts, sounds, and badges." replyButtonText="Replay" allowButtonText="Don't allow" textColor="indigo" hasNoButton={true} alignment="topRightCorner" onButtonClick={handleButtonClick} />

                    <div className="font-bold text-primary">With buttons below   </div>
                    <Notifications imageSrc={profileImageUrl} closeIcon="xmark-regular" closeIconStyle="text-gray-400 hover:text-gray-500" imageStyle="h-10 w-10 rounded-full" titleText="Emilia Gates" descriptionText="Sent you an invite to connect." declineButtonText="Decline" acceptButtonText="Accept" textColor="slate" backgroundColor="indigo" alignment="topRightCorner" onAcceptButtonClick={handleButtonClick} onDeclineButtonClick={handleButtonClick} oncloseButtonClick={handleButtonClick} />
                </div>
            </CardContent>
        </Card>
    )
}


