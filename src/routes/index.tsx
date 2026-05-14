import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portal/Navbar";
import { WelcomeHeader } from "@/components/portal/WelcomeHeader";
import { QuickStats } from "@/components/portal/QuickStats";
import { ProjectStatus } from "@/components/portal/ProjectStatus";
import { WeeklyUpdates } from "@/components/portal/WeeklyUpdates";
import { NextSteps } from "@/components/portal/NextSteps";
import { Deliverables } from "@/components/portal/Deliverables";
import { Communication } from "@/components/portal/Communication";
import { Footer } from "@/components/portal/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
        <WelcomeHeader />
        <QuickStats />
        <ProjectStatus />
        <WeeklyUpdates />
        <NextSteps />
        <Deliverables />
        <Communication />
        <Footer />
      </main>
    </div>
  );
}
