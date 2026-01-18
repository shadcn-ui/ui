"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/bases/base/ui/card"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/bases/base/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
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
      <ComboboxMultipleNoRemove />
      <ComboboxWithCustomItems />
      <ComboboxInDialog />
      <ComboboxWithOtherInputs />
    </ExampleWrapper>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const countries = [
  { code: "", value: "", continent: "", label: "Select country" },
  { code: "af", value: "afghanistan", label: "Afghanistan", continent: "Asia" },
  { code: "al", value: "albania", label: "Albania", continent: "Europe" },
  { code: "dz", value: "algeria", label: "Algeria", continent: "Africa" },
  { code: "ad", value: "andorra", label: "Andorra", continent: "Europe" },
  { code: "ao", value: "angola", label: "Angola", continent: "Africa" },
  {
    code: "ar",
    value: "argentina",
    label: "Argentina",
    continent: "South America",
  },
  { code: "am", value: "armenia", label: "Armenia", continent: "Asia" },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "at", value: "austria", label: "Austria", continent: "Europe" },
  { code: "az", value: "azerbaijan", label: "Azerbaijan", continent: "Asia" },
  {
    code: "bs",
    value: "bahamas",
    label: "Bahamas",
    continent: "North America",
  },
  { code: "bh", value: "bahrain", label: "Bahrain", continent: "Asia" },
  { code: "bd", value: "bangladesh", label: "Bangladesh", continent: "Asia" },
  {
    code: "bb",
    value: "barbados",
    label: "Barbados",
    continent: "North America",
  },
  { code: "by", value: "belarus", label: "Belarus", continent: "Europe" },
  { code: "be", value: "belgium", label: "Belgium", continent: "Europe" },
  { code: "bz", value: "belize", label: "Belize", continent: "North America" },
  { code: "bj", value: "benin", label: "Benin", continent: "Africa" },
  { code: "bt", value: "bhutan", label: "Bhutan", continent: "Asia" },
  {
    code: "bo",
    value: "bolivia",
    label: "Bolivia",
    continent: "South America",
  },
  {
    code: "ba",
    value: "bosnia-and-herzegovina",
    label: "Bosnia and Herzegovina",
    continent: "Europe",
  },
  { code: "bw", value: "botswana", label: "Botswana", continent: "Africa" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "bn", value: "brunei", label: "Brunei", continent: "Asia" },
  { code: "bg", value: "bulgaria", label: "Bulgaria", continent: "Europe" },
  {
    code: "bf",
    value: "burkina-faso",
    label: "Burkina Faso",
    continent: "Africa",
  },
  { code: "bi", value: "burundi", label: "Burundi", continent: "Africa" },
  { code: "kh", value: "cambodia", label: "Cambodia", continent: "Asia" },
  { code: "cm", value: "cameroon", label: "Cameroon", continent: "Africa" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cv", value: "cape-verde", label: "Cape Verde", continent: "Africa" },
  {
    code: "cf",
    value: "central-african-republic",
    label: "Central African Republic",
    continent: "Africa",
  },
  { code: "td", value: "chad", label: "Chad", continent: "Africa" },
  { code: "cl", value: "chile", label: "Chile", continent: "South America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  {
    code: "co",
    value: "colombia",
    label: "Colombia",
    continent: "South America",
  },
  { code: "km", value: "comoros", label: "Comoros", continent: "Africa" },
  { code: "cg", value: "congo", label: "Congo", continent: "Africa" },
  {
    code: "cr",
    value: "costa-rica",
    label: "Costa Rica",
    continent: "North America",
  },
  { code: "hr", value: "croatia", label: "Croatia", continent: "Europe" },
  { code: "cu", value: "cuba", label: "Cuba", continent: "North America" },
  { code: "cy", value: "cyprus", label: "Cyprus", continent: "Asia" },
  {
    code: "cz",
    value: "czech-republic",
    label: "Czech Republic",
    continent: "Europe",
  },
  { code: "dk", value: "denmark", label: "Denmark", continent: "Europe" },
  { code: "dj", value: "djibouti", label: "Djibouti", continent: "Africa" },
  {
    code: "dm",
    value: "dominica",
    label: "Dominica",
    continent: "North America",
  },
  {
    code: "do",
    value: "dominican-republic",
    label: "Dominican Republic",
    continent: "North America",
  },
  {
    code: "ec",
    value: "ecuador",
    label: "Ecuador",
    continent: "South America",
  },
  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
  {
    code: "sv",
    value: "el-salvador",
    label: "El Salvador",
    continent: "North America",
  },
  {
    code: "gq",
    value: "equatorial-guinea",
    label: "Equatorial Guinea",
    continent: "Africa",
  },
  { code: "er", value: "eritrea", label: "Eritrea", continent: "Africa" },
  { code: "ee", value: "estonia", label: "Estonia", continent: "Europe" },
  { code: "et", value: "ethiopia", label: "Ethiopia", continent: "Africa" },
  { code: "fj", value: "fiji", label: "Fiji", continent: "Oceania" },
  { code: "fi", value: "finland", label: "Finland", continent: "Europe" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "ga", value: "gabon", label: "Gabon", continent: "Africa" },
  { code: "gm", value: "gambia", label: "Gambia", continent: "Africa" },
  { code: "ge", value: "georgia", label: "Georgia", continent: "Asia" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "gh", value: "ghana", label: "Ghana", continent: "Africa" },
  { code: "gr", value: "greece", label: "Greece", continent: "Europe" },
  {
    code: "gd",
    value: "grenada",
    label: "Grenada",
    continent: "North America",
  },
  {
    code: "gt",
    value: "guatemala",
    label: "Guatemala",
    continent: "North America",
  },
  { code: "gn", value: "guinea", label: "Guinea", continent: "Africa" },
  {
    code: "gw",
    value: "guinea-bissau",
    label: "Guinea-Bissau",
    continent: "Africa",
  },
  { code: "gy", value: "guyana", label: "Guyana", continent: "South America" },
  { code: "ht", value: "haiti", label: "Haiti", continent: "North America" },
  {
    code: "hn",
    value: "honduras",
    label: "Honduras",
    continent: "North America",
  },
  { code: "hu", value: "hungary", label: "Hungary", continent: "Europe" },
  { code: "is", value: "iceland", label: "Iceland", continent: "Europe" },
  { code: "in", value: "india", label: "India", continent: "Asia" },
  { code: "id", value: "indonesia", label: "Indonesia", continent: "Asia" },
  { code: "ir", value: "iran", label: "Iran", continent: "Asia" },
  { code: "iq", value: "iraq", label: "Iraq", continent: "Asia" },
  { code: "ie", value: "ireland", label: "Ireland", continent: "Europe" },
  { code: "il", value: "israel", label: "Israel", continent: "Asia" },
  { code: "it", value: "italy", label: "Italy", continent: "Europe" },
  {
    code: "jm",
    value: "jamaica",
    label: "Jamaica",
    continent: "North America",
  },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "jo", value: "jordan", label: "Jordan", continent: "Asia" },
  { code: "kz", value: "kazakhstan", label: "Kazakhstan", continent: "Asia" },
  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
  { code: "kw", value: "kuwait", label: "Kuwait", continent: "Asia" },
  { code: "kg", value: "kyrgyzstan", label: "Kyrgyzstan", continent: "Asia" },
  { code: "la", value: "laos", label: "Laos", continent: "Asia" },
  { code: "lv", value: "latvia", label: "Latvia", continent: "Europe" },
  { code: "lb", value: "lebanon", label: "Lebanon", continent: "Asia" },
  { code: "ls", value: "lesotho", label: "Lesotho", continent: "Africa" },
  { code: "lr", value: "liberia", label: "Liberia", continent: "Africa" },
  { code: "ly", value: "libya", label: "Libya", continent: "Africa" },
  {
    code: "li",
    value: "liechtenstein",
    label: "Liechtenstein",
    continent: "Europe",
  },
  { code: "lt", value: "lithuania", label: "Lithuania", continent: "Europe" },
  { code: "lu", value: "luxembourg", label: "Luxembourg", continent: "Europe" },
  { code: "mg", value: "madagascar", label: "Madagascar", continent: "Africa" },
  { code: "mw", value: "malawi", label: "Malawi", continent: "Africa" },
  { code: "my", value: "malaysia", label: "Malaysia", continent: "Asia" },
  { code: "mv", value: "maldives", label: "Maldives", continent: "Asia" },
  { code: "ml", value: "mali", label: "Mali", continent: "Africa" },
  { code: "mt", value: "malta", label: "Malta", continent: "Europe" },
  {
    code: "mh",
    value: "marshall-islands",
    label: "Marshall Islands",
    continent: "Oceania",
  },
  { code: "mr", value: "mauritania", label: "Mauritania", continent: "Africa" },
  { code: "mu", value: "mauritius", label: "Mauritius", continent: "Africa" },
  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
  {
    code: "fm",
    value: "micronesia",
    label: "Micronesia",
    continent: "Oceania",
  },
  { code: "md", value: "moldova", label: "Moldova", continent: "Europe" },
  { code: "mc", value: "monaco", label: "Monaco", continent: "Europe" },
  { code: "mn", value: "mongolia", label: "Mongolia", continent: "Asia" },
  { code: "me", value: "montenegro", label: "Montenegro", continent: "Europe" },
  { code: "ma", value: "morocco", label: "Morocco", continent: "Africa" },
  { code: "mz", value: "mozambique", label: "Mozambique", continent: "Africa" },
  { code: "mm", value: "myanmar", label: "Myanmar", continent: "Asia" },
  { code: "na", value: "namibia", label: "Namibia", continent: "Africa" },
  { code: "nr", value: "nauru", label: "Nauru", continent: "Oceania" },
  { code: "np", value: "nepal", label: "Nepal", continent: "Asia" },
  {
    code: "nl",
    value: "netherlands",
    label: "Netherlands",
    continent: "Europe",
  },
  {
    code: "nz",
    value: "new-zealand",
    label: "New Zealand",
    continent: "Oceania",
  },
  {
    code: "ni",
    value: "nicaragua",
    label: "Nicaragua",
    continent: "North America",
  },
  { code: "ne", value: "niger", label: "Niger", continent: "Africa" },
  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
  { code: "kp", value: "north-korea", label: "North Korea", continent: "Asia" },
  {
    code: "mk",
    value: "north-macedonia",
    label: "North Macedonia",
    continent: "Europe",
  },
  { code: "no", value: "norway", label: "Norway", continent: "Europe" },
  { code: "om", value: "oman", label: "Oman", continent: "Asia" },
  { code: "pk", value: "pakistan", label: "Pakistan", continent: "Asia" },
  { code: "pw", value: "palau", label: "Palau", continent: "Oceania" },
  { code: "ps", value: "palestine", label: "Palestine", continent: "Asia" },
  { code: "pa", value: "panama", label: "Panama", continent: "North America" },
  {
    code: "pg",
    value: "papua-new-guinea",
    label: "Papua New Guinea",
    continent: "Oceania",
  },
  {
    code: "py",
    value: "paraguay",
    label: "Paraguay",
    continent: "South America",
  },
  { code: "pe", value: "peru", label: "Peru", continent: "South America" },
  { code: "ph", value: "philippines", label: "Philippines", continent: "Asia" },
  { code: "pl", value: "poland", label: "Poland", continent: "Europe" },
  { code: "pt", value: "portugal", label: "Portugal", continent: "Europe" },
  { code: "qa", value: "qatar", label: "Qatar", continent: "Asia" },
  { code: "ro", value: "romania", label: "Romania", continent: "Europe" },
  { code: "ru", value: "russia", label: "Russia", continent: "Europe" },
  { code: "rw", value: "rwanda", label: "Rwanda", continent: "Africa" },
  { code: "ws", value: "samoa", label: "Samoa", continent: "Oceania" },
  { code: "sm", value: "san-marino", label: "San Marino", continent: "Europe" },
  {
    code: "sa",
    value: "saudi-arabia",
    label: "Saudi Arabia",
    continent: "Asia",
  },
  { code: "sn", value: "senegal", label: "Senegal", continent: "Africa" },
  { code: "rs", value: "serbia", label: "Serbia", continent: "Europe" },
  { code: "sc", value: "seychelles", label: "Seychelles", continent: "Africa" },
  {
    code: "sl",
    value: "sierra-leone",
    label: "Sierra Leone",
    continent: "Africa",
  },
  { code: "sg", value: "singapore", label: "Singapore", continent: "Asia" },
  { code: "sk", value: "slovakia", label: "Slovakia", continent: "Europe" },
  { code: "si", value: "slovenia", label: "Slovenia", continent: "Europe" },
  {
    code: "sb",
    value: "solomon-islands",
    label: "Solomon Islands",
    continent: "Oceania",
  },
  { code: "so", value: "somalia", label: "Somalia", continent: "Africa" },
  {
    code: "za",
    value: "south-africa",
    label: "South Africa",
    continent: "Africa",
  },
  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
  {
    code: "ss",
    value: "south-sudan",
    label: "South Sudan",
    continent: "Africa",
  },
  { code: "es", value: "spain", label: "Spain", continent: "Europe" },
  { code: "lk", value: "sri-lanka", label: "Sri Lanka", continent: "Asia" },
  { code: "sd", value: "sudan", label: "Sudan", continent: "Africa" },
  {
    code: "sr",
    value: "suriname",
    label: "Suriname",
    continent: "South America",
  },
  { code: "se", value: "sweden", label: "Sweden", continent: "Europe" },
  {
    code: "ch",
    value: "switzerland",
    label: "Switzerland",
    continent: "Europe",
  },
  { code: "sy", value: "syria", label: "Syria", continent: "Asia" },
  { code: "tw", value: "taiwan", label: "Taiwan", continent: "Asia" },
  { code: "tj", value: "tajikistan", label: "Tajikistan", continent: "Asia" },
  { code: "tz", value: "tanzania", label: "Tanzania", continent: "Africa" },
  { code: "th", value: "thailand", label: "Thailand", continent: "Asia" },
  { code: "tl", value: "timor-leste", label: "Timor-Leste", continent: "Asia" },
  { code: "tg", value: "togo", label: "Togo", continent: "Africa" },
  { code: "to", value: "tonga", label: "Tonga", continent: "Oceania" },
  {
    code: "tt",
    value: "trinidad-and-tobago",
    label: "Trinidad and Tobago",
    continent: "North America",
  },
  { code: "tn", value: "tunisia", label: "Tunisia", continent: "Africa" },
  { code: "tr", value: "turkey", label: "Turkey", continent: "Asia" },
  {
    code: "tm",
    value: "turkmenistan",
    label: "Turkmenistan",
    continent: "Asia",
  },
  { code: "tv", value: "tuvalu", label: "Tuvalu", continent: "Oceania" },
  { code: "ug", value: "uganda", label: "Uganda", continent: "Africa" },
  { code: "ua", value: "ukraine", label: "Ukraine", continent: "Europe" },
  {
    code: "ae",
    value: "united-arab-emirates",
    label: "United Arab Emirates",
    continent: "Asia",
  },
  {
    code: "gb",
    value: "united-kingdom",
    label: "United Kingdom",
    continent: "Europe",
  },
  {
    code: "us",
    value: "united-states",
    label: "United States",
    continent: "North America",
  },
  {
    code: "uy",
    value: "uruguay",
    label: "Uruguay",
    continent: "South America",
  },
  { code: "uz", value: "uzbekistan", label: "Uzbekistan", continent: "Asia" },
  { code: "vu", value: "vanuatu", label: "Vanuatu", continent: "Oceania" },
  {
    code: "va",
    value: "vatican-city",
    label: "Vatican City",
    continent: "Europe",
  },
  {
    code: "ve",
    value: "venezuela",
    label: "Venezuela",
    continent: "South America",
  },
  { code: "vn", value: "vietnam", label: "Vietnam", continent: "Asia" },
  { code: "ye", value: "yemen", label: "Yemen", continent: "Asia" },
  { code: "zm", value: "zambia", label: "Zambia", continent: "Africa" },
  { code: "zw", value: "zimbabwe", label: "Zimbabwe", continent: "Africa" },
]

const timezones = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-5) Toronto",
      "(GMT-8) Vancouver",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: [
      "(GMT+0) London",
      "(GMT+1) Paris",
      "(GMT+1) Berlin",
      "(GMT+1) Rome",
      "(GMT+1) Madrid",
      "(GMT+1) Amsterdam",
    ],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Shanghai",
      "(GMT+8) Singapore",
      "(GMT+4) Dubai",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
] as const

function ComboboxBasic() {
  return (
    <Example title="Basic">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select a framework" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxDisabled() {
  return (
    <Example title="Disabled">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select a framework" disabled />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxInvalid() {
  return (
    <Example title="Invalid">
      <div className="flex flex-col gap-4">
        <Combobox items={frameworks}>
          <ComboboxInput placeholder="Select a framework" aria-invalid="true" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Field data-invalid>
          <FieldLabel htmlFor="combobox-framework-invalid">
            Framework
          </FieldLabel>
          <Combobox items={frameworks}>
            <ComboboxInput
              id="combobox-framework-invalid"
              placeholder="Select a framework"
              aria-invalid
            />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
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
  return (
    <Example title="With Clear Button">
      <Combobox items={frameworks} defaultValue={frameworks[0]}>
        <ComboboxInput placeholder="Select a framework" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithGroups() {
  return (
    <Example title="With Groups">
      <Combobox items={timezones}>
        <ComboboxInput placeholder="Select a timezone" />
        <ComboboxContent>
          <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithGroupsAndSeparator() {
  return (
    <Example title="With Groups and Separator">
      <Combobox items={timezones}>
        <ComboboxInput placeholder="Select a timezone" />
        <ComboboxContent>
          <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                <ComboboxSeparator />
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithForm() {
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
                <Combobox items={frameworks}>
                  <ComboboxInput
                    id="framework"
                    name="framework"
                    placeholder="Select a framework"
                    required
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
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

const largeListItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)

function ComboboxLargeList() {
  return (
    <Example title="Large List (100 items)">
      <Combobox items={largeListItems}>
        <ComboboxInput placeholder="Search from 100 items" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxAutoHighlight() {
  return (
    <Example title="With Auto Highlight">
      <Combobox items={frameworks} autoHighlight>
        <ComboboxInput placeholder="Select a framework" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboxboxInputAddon() {
  return (
    <Example title="With Icon Addon">
      <Combobox items={timezones}>
        <ComboboxInput placeholder="Select a timezone">
          <InputGroupAddon>
            <IconPlaceholder
              lucide="GlobeIcon"
              tabler="IconGlobe"
              hugeicons="Globe02Icon"
              phosphor="GlobeIcon"
              remixicon="RiGlobeLine"
            />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent alignOffset={-28} className="w-60">
          <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxInPopup() {
  return (
    <Example title="Combobox in Popup">
      <Combobox items={countries} defaultValue={countries[0]}>
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              className="w-64 justify-between font-normal"
            />
          }
        >
          <ComboboxValue />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxMultiple() {
  const anchor = useComboboxAnchor()

  return (
    <Example title="Combobox Multiple">
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0]]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxMultipleDisabled() {
  const anchor = useComboboxAnchor()

  return (
    <Example title="Combobox Multiple Disabled">
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
        disabled
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput disabled />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxMultipleInvalid() {
  const anchor1 = useComboboxAnchor()
  const anchor2 = useComboboxAnchor()

  return (
    <Example title="Combobox Multiple Invalid">
      <div className="flex flex-col gap-4">
        <Combobox
          multiple
          autoHighlight
          items={frameworks}
          defaultValue={[frameworks[0], frameworks[1]]}
        >
          <ComboboxChips ref={anchor1}>
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput aria-invalid="true" />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor1}>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Field data-invalid>
          <FieldLabel htmlFor="combobox-multiple-invalid">
            Frameworks
          </FieldLabel>
          <Combobox
            multiple
            autoHighlight
            items={frameworks}
            defaultValue={[frameworks[0], frameworks[1], frameworks[2]]}
          >
            <ComboboxChips ref={anchor2}>
              <ComboboxValue>
                {(values) => (
                  <React.Fragment>
                    {values.map((value: string) => (
                      <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      id="combobox-multiple-invalid"
                      aria-invalid
                    />
                  </React.Fragment>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor2}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
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

function ComboboxMultipleNoRemove() {
  const anchor = useComboboxAnchor()

  return (
    <Example title="Combobox Multiple (No Remove)">
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value} showRemove={false}>
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxWithCustomItems() {
  return (
    <Example title="With Custom Item Rendering">
      <Combobox
        items={countries.filter((country) => country.code !== "")}
        itemToStringValue={(country: (typeof countries)[number]) =>
          country.label
        }
      >
        <ComboboxInput placeholder="Search countries..." />
        <ComboboxContent>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            {(country) => (
              <ComboboxItem key={country.code} value={country}>
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
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Example>
  )
}

function ComboboxInDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Example title="Combobox in Dialog">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
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
            <Combobox items={frameworks}>
              <ComboboxInput
                id="framework-dialog"
                placeholder="Select a framework"
              />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
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

const items = [
  {
    label: "Select a framework",
    value: null,
  },
  {
    label: "React",
    value: "react",
  },
  {
    label: "Vue",
    value: "vue",
  },
  {
    label: "Angular",
    value: "angular",
  },
  {
    label: "Svelte",
    value: "svelte",
  },
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Preact",
    value: "preact",
  },
  {
    label: "Next.js",
    value: "next.js",
  },
]

function ComboboxWithOtherInputs() {
  return (
    <Example title="With Other Inputs">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select a framework" className="w-52" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Select items={items}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="text-muted-foreground w-52 justify-between font-normal"
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
