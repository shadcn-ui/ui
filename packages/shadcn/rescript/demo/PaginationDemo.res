@react.component
let make = () =>
  <Pagination>
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.Previous href="#">{React.null}</Pagination.Previous>
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Link href="#">{"1"->React.string}</Pagination.Link>
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Link href="#" dataActive={true}>
          {"2"->React.string}
        </Pagination.Link>
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Link href="#">{"3"->React.string}</Pagination.Link>
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Ellipsis>{React.null}</Pagination.Ellipsis>
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Next href="#">{React.null}</Pagination.Next>
      </Pagination.Item>
    </Pagination.Content>
  </Pagination>
