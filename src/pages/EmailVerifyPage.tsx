import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";

export default function EmailVerify() {
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session?.user && token === session?.user.id) {
        await supabase.from("users").insert({
          id: session.user.id,
          email: session.user.email,
          fullname: session.user.user_metadata.fullname || "",
          language: currentLanguage,
        });
        navigate("/");
      } else {
        setStatus(
          "Verification failed or session missing. Please try logging in again."
        );
      }
    };

    checkSession();
  }, []);

  return <div>{status}</div>;
}
