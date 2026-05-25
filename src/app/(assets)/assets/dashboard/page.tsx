import { Metadata } from "next";
import AssetDashboardClient from "@/components/assets/AssetDashboardClient";

export const metadata: Metadata = {
  title: "Asset Comparison Dashboard | Taxable AI",
  description: "Compare real estate, crypto, and stock performance over 10 years with AI-powered forecasts and tax implications for USA, UK, Saudi Arabia, and Pakistan.",
};

export default function AssetDashboardPage() {
  return <AssetDashboardClient />;
}
