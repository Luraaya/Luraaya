import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const [location, navigate] = useLocation();

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        return;
      }

      const email = session?.user?.email;
      if (!email) {
        console.error("No user session found");
        return;
      }
      // Redirect to dashboard or wherever
      navigate("/dashboard");
    };

    getUserInfo();
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default AuthCallback;
