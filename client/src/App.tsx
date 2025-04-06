import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Legal from "@/pages/Legal";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Layout from "@/components/Layout";

// Create layout-wrapped versions of components
const LayoutHome = () => (
  <Layout>
    <Home />
  </Layout>
);

const LayoutDashboard = () => (
  <Layout>
    <Dashboard />
  </Layout>
);

const LayoutHistory = () => (
  <Layout>
    <History />
  </Layout>
);

const LayoutLegal = () => (
  <Layout>
    <Legal />
  </Layout>
);

const LayoutPrivacyPolicy = () => (
  <Layout>
    <PrivacyPolicy />
  </Layout>
);

const LayoutTermsOfService = () => (
  <Layout>
    <TermsOfService />
  </Layout>
);

const LayoutNotFound = () => (
  <Layout>
    <NotFound />
  </Layout>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={LayoutHome} />
      <Route path="/dashboard" component={LayoutDashboard} />
      <Route path="/history" component={LayoutHistory} />
      <Route path="/legal" component={LayoutLegal} />
      <Route path="/privacy-policy" component={LayoutPrivacyPolicy} />
      <Route path="/terms-of-service" component={LayoutTermsOfService} />
      <Route component={LayoutNotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
