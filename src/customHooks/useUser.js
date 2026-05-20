import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export const useUser = () => {
  const router = useRouter();
  const [documentId, setDocumentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Simple fetch function - NO CACHING
  const fetchUserData = async (docId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/user/fetch?documentId=${docId}`, {
        method: 'GET',
        cache: 'no-cache' // Force fresh data
      });

      const result = await response.json();

      if (result.user) {
        setUser(result.user);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error('useUser: Error fetching user data', err);
      setError(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Initialize documentId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userObj = authService.getStoredUser();
      
      if (!userObj?.documentId) {
        router.push("/login");
      } else {
        setDocumentId(userObj.documentId);
      }
    }
  }, [router]);

  // Fetch user data when documentId changes
  useEffect(() => {
    if (documentId) {
      fetchUserData(documentId);
    }
  }, [documentId]);

  // Simple refetch function - ALWAYS FRESH
  const refetch = () => {
    if (documentId) {
      fetchUserData(documentId);
    }
  };

  // Simple return value
  return { 
    user, 
    loading, 
    error, 
    refetch 
  };
};
