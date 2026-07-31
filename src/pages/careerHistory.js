"use client";

import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { BookMarked } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import PremiumPage from "@/components/premium/PremiumPage";
import EducationSection from "@/components/dashboard/educationSection";
import WorkExperienceSection from "@/components/dashboard/workExperienceSectionPremium";
import CertificationsSection from "@/components/dashboard/certificationsSectionPremium";
import { parseCertifications } from "@/helper/dashboard";
import { authService } from "@/services/authService";

const CareerHistory = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!authService.getStoredUser()) router.push("/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user) return <LoaderTwo text="Loading career history..." />;

  return (
    <>
      <Head>
        <title>Career History — SkillSync AI</title>
      </Head>

      <PremiumPage sx={{ display: "flex", flexDirection: "column", gap: 2.4 }}>
        {/* ── Header ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.4 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #22C55E, #06B6D4)",
              boxShadow: "0 0 28px rgba(34,197,94,0.36)",
              flexShrink: 0,
            }}
          >
            <BookMarked size={24} color="#fff" />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 950, lineHeight: 1.1, fontSize: { xs: "1.45rem", md: "1.75rem" } }}
            >
              Career History
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.87rem", mt: 0.3 }}>
              Education, work experience, and certifications
            </Typography>
          </Box>
        </Box>

        <EducationSection educations={user.educations} />
        <WorkExperienceSection workExperiences={user.workExperiences} />
        <CertificationsSection
          parseCertifications={parseCertifications}
          certifications={user.certifications}
        />
      </PremiumPage>
    </>
  );
};

export default CareerHistory;
