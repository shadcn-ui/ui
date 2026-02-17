@react.component
let make = () =>
  <InputOtp maxLength={6} defaultValue="123456">
    <InputOtp.Group>
      <InputOtp.Slot index={0} />
      <InputOtp.Slot index={1} />
      <InputOtp.Slot index={2} />
      <InputOtp.Slot index={3} />
      <InputOtp.Slot index={4} />
      <InputOtp.Slot index={5} />
    </InputOtp.Group>
  </InputOtp>
