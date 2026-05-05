import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axiosInstance";

const tabs = [
  { id: "login", label: "Login" },
  { id: "signup", label: "Sign up" },
];

const initialLoginValues = {
  email: "",
  password: "",
};

const initialSignupValues = {
  name: "",
  email: "",
  password: "",
};

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || error.message || fallback;
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loginValues, setLoginValues] = useState(initialLoginValues);
  const [signupValues, setSignupValues] = useState(initialSignupValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLoginValue = (field, value) => {
    setLoginValues((current) => ({ ...current, [field]: value }));
  };

  const updateSignupValue = (field, value) => {
    setSignupValues((current) => ({ ...current, [field]: value }));
  };

  const loginUser = async ({ email, password }) => {
    await axiosInstance.post("/api/user/login", { email, password });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!loginValues.email.trim() || !loginValues.password) {
      toast.error("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser({
        email: loginValues.email.trim(),
        password: loginValues.password,
      });
      toast.success("Logged in successfully.");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to log in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    if (
      !signupValues.name.trim() ||
      !signupValues.email.trim() ||
      !signupValues.password
    ) {
      toast.error("Fill in all signup details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credentials = {
        email: signupValues.email.trim(),
        password: signupValues.password,
      };

      await axiosInstance.post("/api/user/register", {
        name: signupValues.name.trim(),
        ...credentials,
      });
      await loginUser(credentials);
      toast.success("Account created successfully.");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create account."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAF9F6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#000000] sm:text-5xl">
            Welcome
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#000000]/70">
            Sign in to continue shopping or create a new account.
          </p>
        </div>

        <div className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-5 sm:p-6">
          <div className="grid grid-cols-2 rounded-lg border border-[#E5E5E5] bg-[#E5E5E5] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 rounded-md text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#000000] text-[#FAF9F6]"
                    : "text-[#000000] hover:bg-[#FAF9F6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-5">
              <label htmlFor="login-email" className="block">
                <span className="text-sm font-medium text-[#000000]">
                  Email
                </span>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={loginValues.email}
                  onChange={(event) =>
                    updateLoginValue("email", event.target.value)
                  }
                  className="mt-2 h-11"
                />
              </label>

              <label htmlFor="login-password" className="block">
                <span className="text-sm font-medium text-[#000000]">
                  Password
                </span>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={loginValues.password}
                  onChange={(event) =>
                    updateLoginValue("password", event.target.value)
                  }
                  className="mt-2 h-11"
                />
              </label>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-[#000000] text-base text-[#FAF9F6] hover:bg-[#000000]/80"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="mt-6 space-y-5">
              <label htmlFor="signup-name" className="block">
                <span className="text-sm font-medium text-[#000000]">Name</span>
                <Input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={signupValues.name}
                  onChange={(event) =>
                    updateSignupValue("name", event.target.value)
                  }
                  className="mt-2 h-11"
                />
              </label>

              <label htmlFor="signup-email" className="block">
                <span className="text-sm font-medium text-[#000000]">
                  Email
                </span>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={signupValues.email}
                  onChange={(event) =>
                    updateSignupValue("email", event.target.value)
                  }
                  className="mt-2 h-11"
                />
              </label>

              <label htmlFor="signup-password" className="block">
                <span className="text-sm font-medium text-[#000000]">
                  Password
                </span>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={signupValues.password}
                  onChange={(event) =>
                    updateSignupValue("password", event.target.value)
                  }
                  className="mt-2 h-11"
                />
              </label>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-[#000000] text-base text-[#FAF9F6] hover:bg-[#000000]/80"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
