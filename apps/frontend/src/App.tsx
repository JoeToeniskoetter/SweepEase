import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LandingPage } from "./pages/LandingPage";
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
import { InspectionOrders } from "./components/InspectionOrders";
import { Inspect } from "./components/Inspect";
import "react-toastify/dist/ReactToastify.css";
import { ReviewAndFinish } from "./pages/ReviewAndFinish";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10000 } },
});

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/company-setup" Component={CreateCompanyPage} />
            </Route>
            <Route element={<OnboardedRoutes />}>
              <Route path="/dashboard" Component={ResponsiveDrawer}>
                <Route path="" element={<Home />} />
                <Route path="inspections" element={<InspectionOrders />} />
                <Route path="templates" element={<InspectionTemplates />} />
                <Route
                  path="templates/:id"
                  element={<EditInspectionTemplate />}
                />
              </Route>
              <Route path="/inspections">
                <Route path=":id/review" element={<ReviewAndFinish />} />
                <Route path=":id" element={<Inspect />} />
              </Route>
            </Route>
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
