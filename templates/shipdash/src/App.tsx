import { Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { Login } from "@/pages/Login"
import { Dashboard } from "@/pages/Dashboard"
import { Settings } from "@/pages/Settings"
import { Billing } from "@/pages/Billing"
import { Customers } from "@/pages/Customers"
import { Analytics } from "@/pages/Analytics"

function App() {
  return (
    <TooltipProvider>
      <Routes>
        {/* Auth routes (no layout) */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard routes (with layout) */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />
        <Route
          path="/customers"
          element={
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          }
        />
        <Route
          path="/billing"
          element={
            <DashboardLayout>
              <Billing />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
      </Routes>
    </TooltipProvider>
  )
}

export default App
