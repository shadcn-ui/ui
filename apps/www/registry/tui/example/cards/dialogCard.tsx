import { Dispatch, forwardRef, useState } from 'react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '../../ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { Icon } from '../../ui/icon'
import { Label } from '../../ui/label'
import { SetStateAction } from 'jotai'

interface DismissButtonProps {
  withLeftAlignButtons?: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const DismissButtons = ({ withLeftAlignButtons, setOpen }: DismissButtonProps) => {
  return (
    <div className={`w-full h-fit px-2 ${withLeftAlignButtons ? "sm:justify-start sm:pl-[16%]" : "justify-end"} sm:flex sm:space-x-2 space-y-2 sm:space-y-0`}>
      <Button onClick={() => setOpen(!open)} variant="outline" className='sm:w-fit w-full font-semibold'>
        Cancel
      </Button>
      <Button onClick={() => setOpen(!open)} variant="default" className='sm:w-fit w-full bg-red-600 hover:bg-red-500 font-semibold'>
        Deactivate
      </Button>
    </div>
  )
}
const OpenDialogButton = forwardRef(({ setOpen }: any, ref) => {
  return (
    <Button variant="outline" onClick={() => setOpen(true)}>
      Open Dialog
    </Button>
  );
});

interface DismissDialogProps {
  showDismissButton?: boolean
  withFooter?: boolean
  withLeftAlignButtons?: boolean
}

export const DismissDialog = ({ showDismissButton, withFooter, withLeftAlignButtons }:
  DismissDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <CardHeader>
        <CardDescription className='pb-2'>
          Simple alert {showDismissButton ? 'with dismiss button' : ''} {withFooter ? 'with gray footer' : ''} {withLeftAlignButtons ? 'with left-aligned buttons' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className='z-60'>
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
          <DialogTrigger asChild>
            <OpenDialogButton setOpen={setOpen} />
          </DialogTrigger>
          <DialogContent className={`md:max-w-2xl sm:max-w-sm max-w-full ${withFooter ? "pb-0 px-0" : ""} `} hideCloseIcon={!showDismissButton}>
            <DialogHeader className='px-14'>
              <DialogTitle className="w-full pt-2 space-y-4">
                <div className='flex-1 sm:flex space-x-2'>
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Icon name="warning-light" className='h-6 w-6 p-3 text-red-600' aria-hidden="true" />
                  </div>
                  <div>
                    <Label className='font-semibold text-xl leading-10'>
                      Deactivate account
                    </Label>
                    <legend className='text-muted-foreground font-light mt-2'>
                      Are you sure you want to deactivate your account?
                      All of your data will be permanently removed from our servers forever.
                      This action cannot be undone.
                    </legend>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            {withFooter ?
              <DialogFooter className='bg-muted px-0 py-4'>
                <DismissButtons withLeftAlignButtons={withLeftAlignButtons} setOpen={setOpen} />
              </DialogFooter> :
              <DismissButtons withLeftAlignButtons={withLeftAlignButtons} setOpen={setOpen} />
            }
          </DialogContent>
        </Dialog>
      </CardContent>
    </>
  )
}

export const BasicExample = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <CardHeader>
        Modals
        <CardDescription className='pb-2'>
          Centered with single action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
          <DialogTrigger asChild>
            <OpenDialogButton setOpen={setOpen} />
          </DialogTrigger>
          <DialogContent className="max-w-lg p-14" hideCloseIcon>
            <DialogHeader>
              <DialogTitle className="w-full pt-2 space-y-4">
                <div className='flex justify-center'>
                  <Icon name="check-circle-solid" className='h-16 w-16 text-green-400' />
                </div>
                <Label className='flex justify-center font-semibold'>
                  Payment Successful
                </Label>
              </DialogTitle>
            </DialogHeader>
            <legend className='text-center text-muted-foreground'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
            </legend>
            <Button variant="default" className='w-full' onClick={() => setOpen(!open)}>
              Go back to dashboard
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </>
  )
}


const DialogCard = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Card className='w-full'>
      {/* 1 */}
      <BasicExample />
      {/* 2 */}
      <CardHeader>
        <CardDescription className='pb-2'>
          Centered with wide buttons
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-lg sm:max-w-sm max-w-xs p-14" hideCloseIcon>
            <DialogHeader>
              <DialogTitle className="w-full pt-2 space-y-4">
                <div className='flex justify-center'>
                  <Icon name="check-circle-solid" className='h-16 w-16 text-green-400' />
                </div>
                <Label className='flex justify-center font-semibold'>
                  Payment Successful
                </Label>
              </DialogTitle>
            </DialogHeader>
            <legend className='text-center text-muted-foreground'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.
            </legend>
            <div className='w-full px-2 flex space-x-2'>
              <Button variant="outline" className='w-full' onClick={() => setOpen(!open)}>
                Cancel
              </Button>
              <Button variant="default" className='w-full' onClick={() => setOpen(!open)}>
                Deactivate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      {/* 3 */}
      <DismissDialog />
      {/* 4 */}
      <DismissDialog showDismissButton />
      {/* 5 */}
      <DismissDialog withFooter />
      {/* 6 */}
      <DismissDialog withLeftAlignButtons />
    </Card>
  )
}

export default DialogCard
