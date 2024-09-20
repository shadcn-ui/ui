import DropdownMenuCheckboxes from "@/registry/default/example/dropdown-menu-checkboxes"
import DropdownMenuDemo from "@/registry/default/example/dropdown-menu-demo"
import DropdownMenuRadioGroupDemo from "@/registry/default/example/dropdown-menu-radio-group"
import DropdownMenuwithDividers from "@/registry/default/example/dropdown-menu-with-divider"
import DropdownMenuwithHeader from "@/registry/default/example/dropdown-menu-with-header"
import DropdownMenuwithIcon from "@/registry/default/example/dropdown-menu-with-icon"
import DropdownMenuSelect from "@/registry/default/example/dropdown-menu-with-search"

export default {
  title: "Components/DropdownMenu",
  component: DropdownMenuDemo,
  argTypes: {
    // Control to select the dropdown menu option
    selectedOption: {
      control: {
        type: "select",
        options: ["Option 1", "Option 2", "Option 3"],
      },
      description: "Select an option from the dropdown menu",
      defaultValue: "Option 1",
    },
    // Control to enable/disable the dropdown menu
    disabled: {
      control: "boolean",
      description: "Toggle to disable or enable the dropdown menu",
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof DropdownMenuDemo>

const Template: ComponentStory<typeof DropdownMenuDemo> = (args) => (
  <DropdownMenuDemo {...args} />
)

export const Demo = Template.bind({})
Demo.args = {
  selectedOption: "Option 1",
  disabled: false,
}

export const WithIcon = () => <DropdownMenuwithIcon />
export const WithCheckboxes = () => <DropdownMenuCheckboxes />
export const WithDividers = () => <DropdownMenuwithDividers />
export const RadioGroup = () => <DropdownMenuRadioGroupDemo />
export const WithHeader = () => <DropdownMenuwithHeader />
export const WithSearch = () => <DropdownMenuSelect />
