@react.component
let make = () =>
  <Carousel className="w-full max-w-[12rem] sm:max-w-xs">
    <Carousel.Content>
      {Belt.Array.makeBy(5, index =>
         <Carousel.Item key={Int.toString(index)}>
           <div className="p-1">
             <Card>
               <div className="aspect-square flex group-data-[size=sm]/card:px-3 items-center justify-center p-6">
                 <span className="text-4xl font-semibold">
                   {Int.toString(index + 1)->React.string}
                 </span>
               </div>
             </Card>
           </div>
         </Carousel.Item>
       )->React.array}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel>
