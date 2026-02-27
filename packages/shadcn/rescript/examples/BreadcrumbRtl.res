@@directive("'use client'")

@react.component
let make = () =>
  <Breadcrumb dir="rtl">
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link render={<a href="/" />}> {"الرئيسية"->React.string} </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>
        <Icons.Dot />
      </Breadcrumb.Separator>
      <Breadcrumb.Item>
        <DropdownMenu>
          <DropdownMenu.Trigger render={<button className="flex items-center gap-1" type_="button" />}>
            {"المكونات"->React.string}
            <Icons.ChevronDown dataIcon="inline-end" className="size-3.5" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align=BaseUi.Types.Align.End dir="rtl" dataLang="ar">
            <DropdownMenu.Group>
              <DropdownMenu.Item> {"التوثيق"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"السمات"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"جيت هاب"->React.string} </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>
        <Icons.Dot />
      </Breadcrumb.Separator>
      <Breadcrumb.Item>
        <Breadcrumb.Page> {"مسار التنقل"->React.string} </Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb>
