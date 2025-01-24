import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/registry/default/ui/form"
import { Input } from "@/registry/default/ui/input"
import {
  Stepper,
  StepperAction,
  StepperControls,
  StepperNavigation,
  StepperStep,
  StepperTitle,
  defineStepper,
} from "@/registry/default/ui/stepper"

const shippingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(5, "Postal code is required"),
})

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  expirationDate: z.string().min(5, "Expiration date is required"),
  cvv: z.string().min(3, "CVV is required"),
})

type ShippingFormValues = z.infer<typeof shippingSchema>
type PaymentFormValues = z.infer<typeof paymentSchema>

const stepperInstance = defineStepper(
  {
    id: "shipping",
    title: "Shipping",
    schema: shippingSchema,
  },
  {
    id: "payment",
    title: "Payment",
    schema: paymentSchema,
  },
  {
    id: "complete",
    title: "Complete",
    schema: z.object({}),
  }
)

export default function StepperForm() {
  return (
    <Stepper instance={stepperInstance}>
      <FormStepperComponent />
    </Stepper>
  )
}

const FormStepperComponent = () => {
  const { steps, useStepper, utils } = stepperInstance
  const methods = useStepper()

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(methods.current.schema),
  })

  const onSubmit = (values: z.infer<typeof methods.current.schema>) => {
    console.log(`Form values for step ${methods.current.id}:`, values)
  }

  const currentIndex = utils.getIndex(methods.current.id)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <StepperNavigation>
          {steps.map((step) => (
            <StepperStep
              key={step.id}
              of={step}
              type={step.id === methods.current.id ? "submit" : "button"}
              onClick={async () => {
                const valid = await form.trigger()
                if (!valid) return
                if (utils.getIndex(step.id) - currentIndex > 1) return
                methods.goTo(step.id)
              }}
            >
              <StepperTitle>{step.title}</StepperTitle>
            </StepperStep>
          ))}
        </StepperNavigation>
        {methods.switch({
          shipping: () => <ShippingForm />,
          payment: () => <PaymentForm />,
          complete: () => <CompleteComponent />,
        })}
        <StepperControls>
          <StepperAction action="prev">Previous</StepperAction>
          <StepperAction
            action="next"
            onBeforeAction={async ({ nextStep }) => {
              const valid = await form.trigger()
              if (!valid) return false
              if (utils.getIndex(nextStep.id as any) - currentIndex > 1)
                return false
              return true
            }}
          >
            Next
          </StepperAction>
          <StepperAction action="reset">Reset</StepperAction>
        </StepperControls>
      </form>
    </Form>
  )
}

const ShippingForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ShippingFormValues>()

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("address").name}
          className="block text-sm font-medium text-primary"
        >
          Address
        </label>
        <Input
          id={register("address").name}
          {...register("address")}
          className="block w-full rounded-md border p-2"
        />
        {errors.address && (
          <span className="text-sm text-destructive">
            {errors.address.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("city").name}
          className="block text-sm font-medium text-primary"
        >
          City
        </label>
        <Input
          id={register("city").name}
          {...register("city")}
          className="block w-full rounded-md border p-2"
        />
        {errors.city && (
          <span className="text-sm text-destructive">
            {errors.city.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("postalCode").name}
          className="block text-sm font-medium text-primary"
        >
          Postal Code
        </label>
        <Input
          id={register("postalCode").name}
          {...register("postalCode")}
          className="block w-full rounded-md border p-2"
        />
        {errors.postalCode && (
          <span className="text-sm text-destructive">
            {errors.postalCode.message}
          </span>
        )}
      </div>
    </div>
  )
}

function PaymentForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PaymentFormValues>()

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("cardNumber").name}
          className="block text-sm font-medium text-primary"
        >
          Card Number
        </label>
        <Input
          id={register("cardNumber").name}
          {...register("cardNumber")}
          className="block w-full rounded-md border p-2"
        />
        {errors.cardNumber && (
          <span className="text-sm text-destructive">
            {errors.cardNumber.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("expirationDate").name}
          className="block text-sm font-medium text-primary"
        >
          Expiration Date
        </label>
        <Input
          id={register("expirationDate").name}
          {...register("expirationDate")}
          className="block w-full rounded-md border p-2"
        />
        {errors.expirationDate && (
          <span className="text-sm text-destructive">
            {errors.expirationDate.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("cvv").name}
          className="block text-sm font-medium text-primary"
        >
          CVV
        </label>
        <Input
          id={register("cvv").name}
          {...register("cvv")}
          className="block w-full rounded-md border p-2"
        />
        {errors.cvv && (
          <span className="text-sm text-destructive">{errors.cvv.message}</span>
        )}
      </div>
    </div>
  )
}

function CompleteComponent() {
  return <div className="text-center">Thank you! Your order is complete.</div>
}
