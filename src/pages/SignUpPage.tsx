import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../components/common/Container";

const SignUpPage: React.FC = () => {
  // Redirect to landing page signup section
  useEffect(() => {
    window.location.href = "/#signup";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container>
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">✨</span>
              </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Redirecting to signup...
          </h2>
          <p className="text-gray-600">
            You're being redirected to our comprehensive signup form.
          </p>
          <div className="mt-4">
            <Link
              to="/#signup"
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Click here if you're not redirected automatically
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignUpPage;
