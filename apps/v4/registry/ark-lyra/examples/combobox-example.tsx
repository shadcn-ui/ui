"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-lyra/components/example"
import { Button } from "@/registry/ark-lyra/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/ark-lyra/ui/card"
import {
  Combobox,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxList,
  ComboboxTrigger,
  useFilter,
  useListCollection,
} from "@/registry/ark-lyra/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ark-lyra/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/ark-lyra/ui/field"
import { Input } from "@/registry/ark-lyra/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ark-lyra/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/ark-lyra/ui/item"
import {
  createListCollection as createSelectListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/registry/ark-lyra/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ComboboxExample() {
  return (
    <ExampleWrapper>
      <ComboboxBasic />
      <ComboboxDisabled />
      <ComboboxInvalid />
      <ComboboxWithClear />
      <ComboboxAutoHighlight />
      <ComboboxWithGroups />
      <ComboboxWithGroupsAndSeparator />
      <ComboboxLargeList />
      <ComboxboxInputAddon />
      <ComboboxInPopup />
      <ComboboxWithForm />
      <ComboboxMultiple />
      <ComboboxMultipleDisabled />
      <ComboboxMultipleInvalid />
      <ComboboxWithCustomItems />
      <ComboboxInDialog />
      <ComboboxWithOtherInputs />
      <ComboboxDisabledItems />
    </ExampleWrapper>
  )
}

const frameworkItems = [
  { label: "Next.js", value: "nextjs" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
]

const disabledFrameworks = ["nuxtjs", "remix"]

const countryItems = [
  { code: "af", value: "afghanistan", label: "Afghanistan", continent: "Asia" },
  { code: "al", value: "albania", label: "Albania", continent: "Europe" },
  { code: "dz", value: "algeria", label: "Algeria", continent: "Africa" },
  { code: "ad", value: "andorra", label: "Andorra", continent: "Europe" },
  { code: "ao", value: "angola", label: "Angola", continent: "Africa" },
  { code: "ar", value: "argentina", label: "Argentina", continent: "South America" },
  { code: "am", value: "armenia", label: "Armenia", continent: "Asia" },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "at", value: "austria", label: "Austria", continent: "Europe" },
  { code: "az", value: "azerbaijan", label: "Azerbaijan", continent: "Asia" },
  { code: "bs", value: "bahamas", label: "Bahamas", continent: "North America" },
  { code: "bh", value: "bahrain", label: "Bahrain", continent: "Asia" },
  { code: "bd", value: "bangladesh", label: "Bangladesh", continent: "Asia" },
  { code: "bb", value: "barbados", label: "Barbados", continent: "North America" },
  { code: "by", value: "belarus", label: "Belarus", continent: "Europe" },
  { code: "be", value: "belgium", label: "Belgium", continent: "Europe" },
  { code: "bz", value: "belize", label: "Belize", continent: "North America" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  { code: "co", value: "colombia", label: "Colombia", continent: "South America" },
  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "in", value: "india", label: "India", continent: "Asia" },
  { code: "it", value: "italy", label: "Italy", continent: "Europe" },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
  { code: "es", value: "spain", label: "Spain", continent: "Europe" },
  { code: "gb", value: "united-kingdom", label: "United Kingdom", continent: "Europe" },
  { code: "us", value: "united-states", label: "United States", continent: "North America" },
]

const americasItems = [
  { label: "(GMT-5) New York", value: "gmt-5-new-york" },
  { label: "(GMT-8) Los Angeles", value: "gmt-8-los-angeles" },
  { label: "(GMT-6) Chicago", value: "gmt-6-chicago" },
  { label: "(GMT-5) Toronto", value: "gmt-5-toronto" },
  { label: "(GMT-8) Vancouver", value: "gmt-8-vancouver" },
  { label: "(GMT-3) Sao Paulo", value: "gmt-3-sao-paulo" },
]

const europeItems = [
  { label: "(GMT+0) London", value: "gmt-0-london" },
  { label: "(GMT+1) Paris", value: "gmt-1-paris" },
  { label: "(GMT+1) Berlin", value: "gmt-1-berlin" },
  { label: "(GMT+1) Rome", value: "gmt-1-rome" },
  { label: "(GMT+1) Madrid", value: "gmt-1-madrid" },
  { label: "(GMT+1) Amsterdam", value: "gmt-1-amsterdam" },
]

const asiaPacificItems = [
  { label: "(GMT+9) Tokyo", value: "gmt-9-tokyo" },
  { label: "(GMT+8) Shanghai", value: "gmt-8-shanghai" },
  { label: "(GMT+8) Singapore", value: "gmt-8-singapore" },
  { label: "(GMT+4) Dubai", value: "gmt-4-dubai" },
  { label: "(GMT+11) Sydney", value: "gmt-11-sydney" },
  { label: "(GMT+9) Seoul", value: "gmt-9-seoul" },
]

const allTimezoneItems = [...americasItems, ...europeItems, ...asiaPacificItems]

const americasValues = new Set(americasItems.map((i) => i.value))
const europeValues = new Set(europeItems.map((i) => i.value))
const asiaPacificValues = new Set(asiaPacificItems.map((i) => i.value))

function ComboboxBasic() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="Basic">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxDisabled() {
  const { collection } = useListCollection({
    initialItems: frameworkItems,
  })

  return (
    <Example title="Disabled">
      <Combobox collection={collection} disabled>
        <ComboboxControl>
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxDisabledItems() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="Disabled Items">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem
                key={item.value}
                item={item}
                disabled={disabledFrameworks.includes(item.value)}
              >
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxInvalid() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="Invalid">
      <div className="flex flex-col gap-4">
        <Combobox
          collection={collection}
          onInputValueChange={(details) => filter(details.inputValue)}
          invalid
        >
          <ComboboxControl>
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxTrigger />
          </ComboboxControl>
          <ComboboxContent>
            <ComboboxList>
              {collection.items.map((item) => (
                <ComboboxItem key={item.value} item={item}>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                  <ComboboxItemIndicator />
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Field data-invalid>
          <FieldLabel htmlFor="combobox-framework-invalid">
            Framework
          </FieldLabel>
          <Combobox
            collection={collection}
            onInputValueChange={(details) => filter(details.inputValue)}
            invalid
          >
            <ComboboxControl>
              <ComboboxInput
                id="combobox-framework-invalid"
                placeholder="Select a framework"
              />
              <ComboboxTrigger />
            </ComboboxControl>
            <ComboboxContent>
              <ComboboxList>
                {collection.items.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldDescription>Please select a valid framework.</FieldDescription>
          <FieldError errors={[{ message: "This field is required." }]} />
        </Field>
      </div>
    </Example>
  )
}

function ComboboxWithClear() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="With Clear Button">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
        defaultValue={["nextjs"]}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxClearTrigger />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithGroups() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: allTimezoneItems,
    filter: contains,
  })

  const filteredAmericas = collection.items.filter((item) =>
    americasValues.has(item.value)
  )
  const filteredEurope = collection.items.filter((item) =>
    europeValues.has(item.value)
  )
  const filteredAsiaPacific = collection.items.filter((item) =>
    asiaPacificValues.has(item.value)
  )

  return (
    <Example title="With Groups">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select a timezone" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {filteredAmericas.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Americas</ComboboxItemGroupLabel>
                {filteredAmericas.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
            {filteredEurope.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Europe</ComboboxItemGroupLabel>
                {filteredEurope.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
            {filteredAsiaPacific.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Asia/Pacific</ComboboxItemGroupLabel>
                {filteredAsiaPacific.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithGroupsAndSeparator() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: allTimezoneItems,
    filter: contains,
  })

  const filteredAmericas = collection.items.filter((item) =>
    americasValues.has(item.value)
  )
  const filteredEurope = collection.items.filter((item) =>
    europeValues.has(item.value)
  )
  const filteredAsiaPacific = collection.items.filter((item) =>
    asiaPacificValues.has(item.value)
  )

  return (
    <Example title="With Groups and Separator">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select a timezone" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {filteredAmericas.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Americas</ComboboxItemGroupLabel>
                {filteredAmericas.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
            {filteredEurope.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Europe</ComboboxItemGroupLabel>
                {filteredEurope.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
            {filteredAsiaPacific.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Asia/Pacific</ComboboxItemGroupLabel>
                {filteredAsiaPacific.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithForm() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const framework = formData.get("framework") as string
    toast(`You selected ${framework} as your framework.`)
  }

  return (
    <Example title="Form with Combobox">
      <Card className="w-full max-w-sm" size="sm">
        <CardContent>
          <form
            id="form-with-combobox"
            className="w-full"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="framework">Framework</FieldLabel>
                <Combobox
                  collection={collection}
                  onInputValueChange={(details) => filter(details.inputValue)}
                  name="framework"
                >
                  <ComboboxControl>
                    <ComboboxInput
                      id="framework"
                      placeholder="Select a framework"
                    />
                    <ComboboxTrigger />
                  </ComboboxControl>
                  <ComboboxContent>
                    <ComboboxList>
                      {collection.items.map((item) => (
                        <ComboboxItem key={item.value} item={item}>
                          <ComboboxItemText>{item.label}</ComboboxItemText>
                          <ComboboxItemIndicator />
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="form-with-combobox">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </Example>
  )
}

const largeListItems = Array.from({ length: 100 }, (_, i) => ({
  label: `Item ${i + 1}`,
  value: `item-${i + 1}`,
}))

function ComboboxLargeList() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: largeListItems,
    filter: contains,
  })

  return (
    <Example title="Large List (100 items)">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Search from 100 items" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxAutoHighlight() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="With Auto Highlight">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
        autoFocus
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboxboxInputAddon() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: allTimezoneItems,
    filter: contains,
  })

  const filteredAmericas = collection.items.filter((item) =>
    americasValues.has(item.value)
  )
  const filteredEurope = collection.items.filter((item) =>
    europeValues.has(item.value)
  )
  const filteredAsiaPacific = collection.items.filter((item) =>
    asiaPacificValues.has(item.value)
  )

  return (
    <Example title="With Icon Addon">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <IconPlaceholder
            lucide="GlobeIcon"
            tabler="IconGlobe"
            hugeicons="Globe02Icon"
            phosphor="GlobeIcon"
            remixicon="RiGlobeLine"
          />
          <ComboboxInput placeholder="Select a timezone" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {filteredAmericas.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Americas</ComboboxItemGroupLabel>
                {filteredAmericas.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
            {filteredEurope.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Europe</ComboboxItemGroupLabel>
                {filteredEurope.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
            {filteredAsiaPacific.length > 0 && (
              <ComboboxItemGroup>
                <ComboboxItemGroupLabel>Asia/Pacific</ComboboxItemGroupLabel>
                {filteredAsiaPacific.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxItemGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxInPopup() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: countryItems,
    filter: contains,
  })

  return (
    <Example title="Combobox in Popup">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxTrigger asChild>
            <Button
              variant="outline"
              className="w-64 justify-between font-normal"
            >
              Select country
            </Button>
          </ComboboxTrigger>
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxInput placeholder="Search" />
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxMultiple() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="Combobox Multiple">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
        multiple
        defaultValue={["nextjs"]}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select frameworks" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxMultipleDisabled() {
  const { collection } = useListCollection({
    initialItems: frameworkItems,
  })

  return (
    <Example title="Combobox Multiple Disabled">
      <Combobox
        collection={collection}
        multiple
        defaultValue={["nextjs", "sveltekit"]}
        disabled
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Select frameworks" />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxMultipleInvalid() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="Combobox Multiple Invalid">
      <div className="flex flex-col gap-4">
        <Combobox
          collection={collection}
          onInputValueChange={(details) => filter(details.inputValue)}
          multiple
          defaultValue={["nextjs", "sveltekit"]}
          invalid
        >
          <ComboboxControl>
            <ComboboxInput placeholder="Select frameworks" />
            <ComboboxTrigger />
          </ComboboxControl>
          <ComboboxContent>
            <ComboboxList>
              {collection.items.map((item) => (
                <ComboboxItem key={item.value} item={item}>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                  <ComboboxItemIndicator />
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Field data-invalid>
          <FieldLabel htmlFor="combobox-multiple-invalid">
            Frameworks
          </FieldLabel>
          <Combobox
            collection={collection}
            onInputValueChange={(details) => filter(details.inputValue)}
            multiple
            defaultValue={["nextjs", "sveltekit", "nuxtjs"]}
            invalid
          >
            <ComboboxControl>
              <ComboboxInput
                id="combobox-multiple-invalid"
                placeholder="Select frameworks"
              />
              <ComboboxTrigger />
            </ComboboxControl>
            <ComboboxContent>
              <ComboboxList>
                {collection.items.map((item) => (
                  <ComboboxItem key={item.value} item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldDescription>
            Please select at least one framework.
          </FieldDescription>
          <FieldError errors={[{ message: "This field is required." }]} />
        </Field>
      </div>
    </Example>
  )
}

function ComboboxWithCustomItems() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: countryItems,
    filter: contains,
  })

  return (
    <Example title="With Custom Item Rendering">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput placeholder="Search countries..." />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((country) => (
              <ComboboxItem key={country.value} item={country}>
                <ComboboxItemText>
                  <Item size="xs" className="p-0">
                    <ItemContent>
                      <ItemTitle className="whitespace-nowrap">
                        {country.label}
                      </ItemTitle>
                      <ItemDescription>
                        {country.continent} ({country.code})
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxInDialog() {
  const [open, setOpen] = React.useState(false)
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="Combobox in Dialog">
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Framework</DialogTitle>
            <DialogDescription>
              Choose your preferred framework from the list below.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="framework-dialog" className="sr-only">
              Framework
            </FieldLabel>
            <Combobox
              collection={collection}
              onInputValueChange={(details) => filter(details.inputValue)}
            >
              <ComboboxControl>
                <ComboboxInput
                  id="framework-dialog"
                  placeholder="Select a framework"
                />
                <ComboboxTrigger />
              </ComboboxControl>
              <ComboboxContent>
                <ComboboxList>
                  {collection.items.map((item) => (
                    <ComboboxItem key={item.value} item={item}>
                      <ComboboxItemText>{item.label}</ComboboxItemText>
                      <ComboboxItemIndicator />
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                toast("Framework selected.")
                setOpen(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

const selectFrameworksCollection = createSelectListCollection({
  items: frameworkItems,
})

function ComboboxWithOtherInputs() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Example title="With Other Inputs">
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
      >
        <ComboboxControl>
          <ComboboxInput
            placeholder="Select a framework"
            className="w-52"
          />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent>
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Select collection={selectFrameworksCollection}>
        <SelectControl className="w-52">
          <SelectTrigger>
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent>
          <SelectItemGroup>
            {selectFrameworksCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="w-52 justify-between font-normal text-muted-foreground"
      >
        Select a framework
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconSelector"
          hugeicons="UnfoldMoreIcon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
        />
      </Button>
      <Input placeholder="Select a framework" className="w-52" />
      <InputGroup className="w-52">
        <InputGroupInput placeholder="Select a framework" />
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconSelector"
            hugeicons="UnfoldMoreIcon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
          />
        </InputGroupAddon>
      </InputGroup>
    </Example>
  )
}
