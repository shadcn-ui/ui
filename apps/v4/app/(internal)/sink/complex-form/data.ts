export const phoneModels = [
  {
    value: "iphone-17",
    label: "iPhone 17",
    price: 899,
    description: "Latest A19 chip with advanced dual-camera system"
  },
  {
    value: "iphone-17-air",
    label: "iPhone 17 Air",
    price: 1099,
    description: "Ultra-thin design with all-day battery life"
  },
  {
    value: "iphone-17-pro",
    label: "iPhone 17 Pro",
    price: 1199,
    description: "Pro camera system with 6x telephoto zoom and titanium design"
  },
]

export const universalColors = [
  { value: "silver", label: "Silver", description: "Classic metallic shine", color: "#e3e4e6" },
  { value: "cosmic-orange", label: "Cosmic Orange", description: "Bold vibrant orange", color: "#ff6b35" },
  { value: "deep-blue", label: "Deep Blue", description: "Rich ocean blue", color: "#1e3a8a" },
]

export const phoneColors = {
  "iphone-17": universalColors,
  "iphone-17-air": universalColors,
  "iphone-17-pro": universalColors,
}

export const storageOptions = [
  { value: "128gb", label: "128GB", price: 0, description: "Perfect for basic usage" },
  { value: "256gb", label: "256GB", price: 100, description: "Great for photos and apps" },
  { value: "512gb", label: "512GB", price: 300, description: "Ideal for heavy users" },
  { value: "1tb", label: "1TB", price: 500, description: "Maximum storage capacity" },
]

export const accessories = [
  { value: "magsafe-charger", label: "MagSafe Charger", price: 39, description: "Wireless charging made easy" },
  { value: "airpods-pro", label: "AirPods Pro", price: 249, description: "Active noise cancellation" },
  { value: "apple-watch", label: "Apple Watch", price: 399, description: "Fitness and health tracking" },
  { value: "phone-case", label: "Premium Phone Case", price: 49, description: "Ultimate protection and style" },
  { value: "screen-protector", label: "Screen Protector", price: 29, description: "Scratch and impact resistant" },
]

export const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
]

export const states = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
]