import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Download, Mail } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";
import { formatReportText } from "@/utils/textFormatting";

const QuizReportPage = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const reportId = router.query.reportId;
    if (!reportId || typeof window === "undefined") return;

    const storedReport = localStorage.getItem(`skillsyncQuizReport:${reportId}`);
    if (!storedReport) return;

    try {
      setReportData(JSON.parse(storedReport));
    } catch (error) {
      console.error("Invalid quiz report data:", error);
    }
  }, [router.isReady, router.query.reportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (!reportData?.report) return;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      reportData.title || "SkillSync Quiz Report"
    )}&body=${encodeURIComponent(formatReportText(reportData.report))}`;
  };

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 1, md: 2 }, py: 3 }}>
      <PremiumCard hover={false} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 950 }}>
              {reportData?.title || "SkillSync Quiz Report"}
            </Typography>
            {reportData?.generatedAt && (
              <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
                Generated on {new Date(reportData.generatedAt).toLocaleString()}
              </Typography>
            )}
          </Box>
          {reportData && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
              <PremiumButton onClick={handlePrint} startIcon={<Download size={17} />}>
                PDF Download
              </PremiumButton>
              <Button
                variant="outlined"
                onClick={handleEmail}
                startIcon={<Mail size={17} />}
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}
              >
                Email Report
              </Button>
            </Stack>
          )}
        </Stack>

        {reportData ? (
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              bgcolor: "rgba(255,255,255,0.045)",
              color: "#E5E7EB",
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              lineHeight: 1.7,
            }}
          >
            {formatReportText(reportData.report)}
          </Box>
        ) : (
          <Alert severity="warning">
            Report data is not available in this browser. Please generate the report again after quiz submission.
          </Alert>
        )}
      </PremiumCard>
    </Box>
  );
};

export default QuizReportPage;
