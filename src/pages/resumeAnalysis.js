"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import { useResumeAnalysis } from "@/customHooks/useResumeAnalysis";

const ResumeAnalysis = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { profileSummary, learningSuggestions, loadingResume, error } =
    useResumeAnalysis(user);

  // Redirect if no user
  if (!user && !userLoading) {
    router.push("/login");
    return null;
  }

  // Show loader while fetching user or analyzing resume
  if (userLoading || loadingResume) {
    return <LoaderTwo text="Analyzing Your Resume..." />;
  }

  // Show message if no resume uploaded
  if (!user?.uploadResume) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">No Resume Found</h1>
        <p>Please upload your resume in Strapi to see the AI-generated summary.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Show error if any */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Profile Summary */}
      <div className="bg-white shadow-md p-4 rounded-md mb-6">
        <h2 className="font-semibold text-lg mb-2" style={{fontSize:"1.4rem",color:"#1976d2"}}>Profile Summary</h2>
        {profileSummary ? (
          <div className="text-gray-700 whitespace-pre-wrap" style={{borderBottom: "3px solid #494949ff", marginBottom: "20px", paddingBottom:"25px"}}>
            {profileSummary.split("\n").map((line, idx) => (
              <p key={idx} className="mb-0" style={{margin:0}}>
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500" style={{margin:0}}>Profile summary is not available.</p>
        )}
      </div>

      {/* Learning Suggestions */}
      <div>
        <h2 className="font-semibold text-lg mb-4" style={{fontSize:"1.4rem", color:"#1976d2"}}>Learning Suggestions</h2>
        {learningSuggestions?.length > 0 ? (
          <div className="space-y-4 ">
            {learningSuggestions.map(({ area, recommendation }, idx) => (
              <div key={idx} className="bg-gray-100  rounded-md learning-suggestion">
                <h3 className="font-semibold text-md mb-2">{area}</h3>
                <p className="text-gray-700 whitespace-pre-wrap" style={{margin:0}}>{recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No learning suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
