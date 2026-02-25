@react.component
let make = () =>
  <Card className="w-full max-w-sm">
    <Card.Header>
      <Card.Title> {"Login to your account"->React.string} </Card.Title>
      <Card.Description>
        {"Enter your email below to login to your account"->React.string}
      </Card.Description>
      <Card.Action>
        <Button variant=BaseUi.Types.Variant.Link> {"Sign Up"->React.string} </Button>
      </Card.Action>
    </Card.Header>
    <Card.Content>
      <form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email"> {"Email"->React.string} </Label>
            <Input id="email" type_="email" placeholder="m@example.com" required={true}>
              {React.null}
            </Input>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password"> {"Password"->React.string} </Label>
              <a
                href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                {"Forgot your password?"->React.string}
              </a>
            </div>
            <Input id="password" type_="password" required={true}> {React.null} </Input>
          </div>
        </div>
      </form>
    </Card.Content>
    <Card.Footer className="flex-col gap-2">
      <Button type_="submit" className="w-full"> {"Login"->React.string} </Button>
      <Button variant=BaseUi.Types.Variant.Outline className="w-full">
        {"Login with Google"->React.string}
      </Button>
    </Card.Footer>
  </Card>
