import React from "react";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { Award, BadgeCheck, Medal, ShieldCheck, Sparkles } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const getCertificationType = (cert) => {
  const certLower = String(cert).toLowerCase();
  if (certLower.includes("aws") || certLower.includes("azure") || certLower.includes("gcp")) return "Cloud";
  if (certLower.includes("security") || certLower.includes("cissp") || certLower.includes("ceh")) return "Security";
  if (certLower.includes("project") || certLower.includes("pmp") || certLower.includes("scrum")) return "Management";
  if (certLower.includes("data") || certLower.includes("analytics") || certLower.includes("ml")) return "Data";
  if (certLower.includes("devops") || certLower.includes("docker") || certLower.includes("kubernetes")) return "DevOps";
  return "Credential";
};

const CertificationsSectionPremium = ({ certifications, parseCertifications }) => {
  const certList = parseCertifications(certifications);

  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader
        eyebrow="Proof Of Skill"
        title="Certifications & Awards"
        description="Verified credentials, awards, and professional recognition."
        action={<Sparkles size={22} color="#06B6D4" />}
      />

      {certList.length > 0 ? (
        <Grid container spacing={2.2}>
          {certList.map((cert, index) => {
            const accent = ["#7C3AED", "#06B6D4", "#22C55E", "#F59E0B"][index % 4];
            const certType = getCertificationType(cert);

            return (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={`${cert}-${index}`}>
                <PremiumCard glow={`${accent}33`} sx={{ p: 2.6, height: "100%" }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "18px",
                        display: "grid",
                        placeItems: "center",
                        background: `linear-gradient(135deg, ${accent}, #06B6D4)`,
                        boxShadow: `0 18px 38px ${accent}42`,
                        flex: "0 0 auto",
                      }}
                    >
                      <Award size={23} color="#fff" />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, lineHeight: 1.25 }}>
                        {cert}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: 14, mt: 0.5 }}>
                        Professional credential
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      border: `1px solid ${accent}35`,
                      background: `linear-gradient(135deg, ${accent}1f, rgba(6,182,212,0.08))`,
                      mb: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Box>
                        <Typography sx={{ color: accent, fontWeight: 900, fontSize: 22 }}>
                          {certType}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                          Certification category
                        </Typography>
                      </Box>
                      <Medal size={34} color={accent} />
                    </Stack>
                  </Box>

                  <Stack spacing={1.1}>
                    <Chip
                      icon={<BadgeCheck size={15} />}
                      label="Verified professional signal"
                      sx={{ justifyContent: "flex-start", color: "#fff" }}
                    />
                    <Chip
                      icon={<ShieldCheck size={15} />}
                      label="Industry recognized"
                      sx={{ justifyContent: "flex-start", color: "#fff" }}
                    />
                  </Stack>
                </PremiumCard>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <PremiumCard hover={false} sx={{ p: 3, textAlign: "center" }}>
          <Box
            sx={{
              mx: "auto",
              mb: 2,
              width: 62,
              height: 62,
              borderRadius: "20px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <Award size={28} color="#06B6D4" />
          </Box>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
            No Certifications Listed
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.8 }}>
            Add certifications and awards to strengthen your profile signal.
          </Typography>
        </PremiumCard>
      )}
    </Box>
  );
};

export default CertificationsSectionPremium;
