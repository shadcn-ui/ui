@react.component
let make = () =>
  <Breadcrumb>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link render={<a href="/" />}> {"Home"->React.string} </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>
        <Icons.Dot />
      </Breadcrumb.Separator>
      <Breadcrumb.Item>
        <Breadcrumb.Link render={<a href="/components" />}> {"Components"->React.string} </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>
        <Icons.Dot />
      </Breadcrumb.Separator>
      <Breadcrumb.Item>
        <Breadcrumb.Page> {"Breadcrumb"->React.string} </Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb>
