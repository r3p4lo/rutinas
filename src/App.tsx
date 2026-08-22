import type { ComponentType } from "react";
import { AppProvider, useApp } from "./services/store";
import { Shell } from "./layouts/Shell";
import { Dashboard } from "./pages/Dashboard";
import { MasterLife } from "./pages/MasterLife";
import { Goals } from "./pages/Goals";
import { Tasks } from "./pages/Tasks";
import { Projects } from "./pages/Projects";
import { Skills } from "./pages/Skills";
import { Finance } from "./pages/Finance";
import { Research } from "./pages/Research";
import { AISystem } from "./pages/AISystem";
import { Business } from "./pages/Business";
import { Portfolio } from "./pages/Portfolio";
import { Analytics } from "./pages/Analytics";
import { Evaluation } from "./pages/Evaluation";
import { Settings } from "./pages/Settings";

const PAGES: Record<string, ComponentType> = {
  dashboard: Dashboard,
  "master-life": MasterLife,
  goals: Goals,
  tasks: Tasks,
  projects: Projects,
  skills: Skills,
  finance: Finance,
  research: Research,
  ai: AISystem,
  business: Business,
  portfolio: Portfolio,
  analytics: Analytics,
  evaluation: Evaluation,
  settings: Settings,
};

function Screen() {
  const { route } = useApp();
  const Page = PAGES[route.page] ?? Dashboard;
  return (
    <div key={route.page + (route.param ?? "")} className="reveal">
      <Page />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <Screen />
      </Shell>
    </AppProvider>
  );
}
