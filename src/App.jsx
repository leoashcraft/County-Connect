import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/auth/AuthContext"
import { SiteSettingsProvider } from "@/hooks/useSiteSettings"

function App() {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <Pages />
        <Toaster />
      </AuthProvider>
    </SiteSettingsProvider>
  )
}

export default App 