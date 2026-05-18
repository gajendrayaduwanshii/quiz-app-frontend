import { Box, Typography } from "@mui/material";
import { BrainCircuit } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const DashboardInsightsSection = ({ dashboardInsights }) => {
  const safeRender = (content) => {
    if (!content) return "";
    if (typeof content === "string") {
      return content.trim() === "" ? "" : content;
    }
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === "object") {
          return JSON.stringify(item, null, 2);
        }
        return item;
      }).join("\n\n");
    }
    if (typeof content === "object") {
      // If it's an object, try to extract meaningful text
      if (content.text) return content.text;
      if (content.description) return content.description;
      if (content.value) return content.value;
      if (content.name) return content.name;
      // Otherwise return formatted JSON
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  };

  if (!dashboardInsights) {
    return (
      <PremiumCard hover={false} sx={{ p: 3 }}>
        <SectionHeader
          title="AI Insights"
          description="Dashboard intelligence is ready when AI widgets are enabled."
          action={<BrainCircuit size={22} color="#06B6D4" />}
        />
        <Typography sx={{ color: "text.secondary" }}>No live AI insight loaded right now.</Typography>
      </PremiumCard>
    );
  }

  const InsightCard = ({ title, children }) => (
    <PremiumCard hover={false} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" className="gradient-text" sx={{ fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
        {children}
      </Typography>
    </PremiumCard>
  );

  return (
    <Box>
      {dashboardInsights.summary && (
        <InsightCard title="Profile Summary">{safeRender(dashboardInsights.summary)}</InsightCard>
      )}
      {dashboardInsights.rolesAndResponsibilities && (
        <InsightCard title="Suitable Roles & Responsibilities">{safeRender(dashboardInsights.rolesAndResponsibilities)}</InsightCard>
      )}
      {dashboardInsights.studyPlan && (
        <InsightCard title="Study & Focus Recommendations">{safeRender(dashboardInsights.studyPlan)}</InsightCard>
      )}
      {dashboardInsights.skillGaps && (
        <InsightCard title="Critical Skill Gaps">{safeRender(dashboardInsights.skillGaps)}</InsightCard>
      )}
      {dashboardInsights.marketInsights && (
        <InsightCard title="Market Insights & Trends">{safeRender(dashboardInsights.marketInsights)}</InsightCard>
      )}
      {dashboardInsights.careerPath && (
        <InsightCard title="Career Progression Path">{safeRender(dashboardInsights.careerPath)}</InsightCard>
      )}
    </Box>
  );
};

export default DashboardInsightsSection;
