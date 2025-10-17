import { useState, useEffect, useMemo, useCallback } from "react";

export const useUserSummary = (user) => {
  const [dashboardInsights, setDashboardInsights] = useState({
    summary: "",
    rolesAndResponsibilities: "",
    studyPlan: "",
  });
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserSummary = useCallback(async () => {
    if (!user) return;

    setLoadingDashboard(true);
    setError(null);

    try {
      const res = await fetch("/api/user/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      const data = await res.json();

      if (res.ok) {
        setDashboardInsights({
          summary: data.summary || "",
          rolesAndResponsibilities: data.rolesAndResponsibilities || "",
          studyPlan: data.studyPlan || "",
        });
      } else {
        setError(data.error);
        setDashboardInsights({
          summary: "",
          rolesAndResponsibilities: "",
          studyPlan: "",
        });
      }
    } catch (err) {
      setError(err.message);
      setDashboardInsights({
        summary: "",
        rolesAndResponsibilities: "",
        studyPlan: "",
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserSummary();
  }, [fetchUserSummary]);

  const refetch = useCallback(() => {
    fetchUserSummary();
  }, [fetchUserSummary]);

  return useMemo(() => ({ 
    dashboardInsights, 
    loadingDashboard, 
    error, 
    refetch 
  }), [dashboardInsights, loadingDashboard, error, refetch]);
};
