import { LandingPage } from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./pages/SignInPage";
import { AuthProvider } from "./context/AuthContext";
import { OnboardedRoutes } from "./components/OnboardedRoutes";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { Home } from "./components/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateCompanyPage } from "./pages/CreateCompanyPage";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { InspectionTemplates } from "./components/InspectionTemplates";
import { EditInspectionTemplate } from "./components/EditInspectionTemplate";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/company-setup" element={<ProtectedRoutes />}>
              <Route path="" Component={CreateCompanyPage} />
            </Route>
            <Route element={<OnboardedRoutes />}>
              <Route path="/dashboard" Component={ResponsiveDrawer}>
                <Route path="" element={<Home />} />
                <Route path="inspections" element={<div>Inspections</div>} />
                <Route path="templates" element={<InspectionTemplates />} />
                <Route
                  path="templates/:id"
                  element={<EditInspectionTemplate />}
                />
              </Route>
            </Route>
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
