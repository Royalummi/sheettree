import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import api from "../../services/api";

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication failed: " + error);
      navigate("/login");
      return;
    }

    if (token) {
      try {
        // Store token
        localStorage.setItem("token", token);

        let user = null;

        // Try to get user data from URL parameter first
        if (userParam) {
          try {
            user = JSON.parse(atob(decodeURIComponent(userParam)));
          } catch (e) {
            console.warn("Failed to parse user data from URL parameter:", e);
          }
        }

        if (user) {
          // Store user data
          localStorage.setItem("user", JSON.stringify(user));
          dispatch(loginSuccess({ token, user }));
          toast.success("Successfully logged in!");
          navigate("/dashboard");
        } else {
          // Fallback: fetch user profile from API
          api
            .get("/user/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const data = response.data;
              if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch(loginSuccess({ token, user: data.user }));
                toast.success("Successfully logged in!");
                navigate("/dashboard");
              } else {
                throw new Error("User data not found");
              }
            })
            .catch((err) => {
              console.error("Error fetching user profile:", err);
              toast.error("Error processing authentication");
              navigate("/login");
            });
        }
      } catch (err) {
        console.error("Error processing authentication:", err);
        toast.error("Error processing authentication");
        navigate("/login");
      }
    } else {
      toast.error("No authentication token received");
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">
          Processing authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
