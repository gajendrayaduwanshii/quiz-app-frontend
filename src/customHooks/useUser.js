import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useUser = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async (documentId) => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/userlists?filters[documentId][$eq]=${documentId}&populate[uploadResume][populate]=*&populate[skills]=*&populate[workExperiences]=*&populate[educations]=*&populate[quizResult][populate]=*`
        );
        const result = await response.json();

        if (result?.data?.length > 0) {
          setUser(result.data[0]);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    const init = () => {
      const storedUser = localStorage.getItem("user");
      const userObj = storedUser ? JSON.parse(storedUser) : null;

      if (!userObj?.documentId) {
        router.push("/login");
      } else {
        fetchUserData(userObj.documentId);
      }
    };

    if (typeof window !== "undefined") {
      init();
    }
  }, [router]);

  return { user, loading };
};
