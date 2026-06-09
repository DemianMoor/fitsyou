import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./components/HomePage";
import { HowItFitsPage } from "./components/HowItFitsPage";
import { PlanBuilderPage } from "./components/PlanBuilderPage";
import { MealKitsPage } from "./components/MealKitsPage";
import { SupplementsPage } from "./components/SupplementsPage";
import { TrainingPage } from "./components/TrainingPage";
import { StoriesPage } from "./components/StoriesPage";
import { PricingPage } from "./components/PricingPage";
import { TrustFAQPage } from "./components/TrustFAQPage";
import { AboutPage } from "./components/AboutPage";
import { BlogPage } from "./components/BlogPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "how", Component: HowItFitsPage },
      { path: "plan", Component: PlanBuilderPage },
      { path: "meal-kits", Component: MealKitsPage },
      { path: "supplements", Component: SupplementsPage },
      { path: "training", Component: TrainingPage },
      { path: "stories", Component: StoriesPage },
      { path: "pricing", Component: PricingPage },
      { path: "trust", Component: TrustFAQPage },
      { path: "about", Component: AboutPage },
      { path: "blog", Component: BlogPage },
    ],
  },
]);
