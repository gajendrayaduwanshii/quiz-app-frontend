import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

// In-memory cache shared across all hook instances in the same session
const cache = { data: null, documentId: null };

export const useUser = () => {
  const router = useRouter();
  const [documentId, setDocumentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => cache.data || null);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchUserData = async (docId, { force = false } = {}) => {
    // Return cached data instantly if same user and not forced
    if (!force && cache.data && cache.documentId === docId) {
      setUser(cache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/fetch?documentId=${docId}`, {
        method: "GET",
      });

      const result = await response.json();

      if (result.user) {
        cache.data = result.user;
        cache.documentId = docId;
        setUser(result.user);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("useUser: Error fetching user data", err);
      setError(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Initialize documentId from localStorage — run once only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const userObj = authService.getStoredUser();
    if (!userObj?.documentId) {
      router.push("/login");
    } else {
      setDocumentId(userObj.documentId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when documentId is set — skip if already fetched this session
  useEffect(() => {
    if (!documentId || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUserData(documentId);
  }, [documentId]);

  // Force a fresh fetch from Strapi and update cache
  const refetch = () => {
    if (documentId) fetchUserData(documentId, { force: true });
  };

  return { user, loading, error, refetch };
};
