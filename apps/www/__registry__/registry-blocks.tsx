export const blocks = [
  {
    name: "step-progress-01",
    author: "Wamunyima Mukelabai (http://wamunyimamukelabai.vercel.app/)",
    title: "Step Progress",
    description: "A versatile step progress component for multi-step processes like onboarding, checkout, and approval workflows. Features status badges, custom icons, progress tracking, and responsive layouts.",
    type: "registry:block",
    registryDependencies: ["badge", "card", "progress"],
    dependencies: ["lucide-react"],
    files: [
      {
        path: "blocks/step-progress-01/page.tsx",
        type: "registry:page",
        target: "app/step-progress/page.tsx",
      },
      {
        path: "blocks/step-progress-01/components/step-progress.tsx",
        type: "registry:component",
      },
    ],
    categories: ["dashboard"],
  },
]