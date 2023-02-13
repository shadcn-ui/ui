export interface User {
  id: string
  email: string
  name: string
  avatar: string
}

export interface Workspace {
  id: string
  name: string
  icon: (props: React.SVGAttributes<SVGSVGElement>) => JSX.Element
}

export interface Preset {
  id: string
  name: string
}

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export interface Example {
  title: string
  description: string
  icon: (props: React.SVGAttributes<SVGSVGElement>) => JSX.Element
  color: string
  href: string
}
