import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { useLoginAdminMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import { createAdmin } from "@/redux/features/auth/create";

// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const LoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const router = useRouter();
  const { redirect } = router.query;
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // onSubmit
  const onSubmit = async (data) => {
    try {
      const result = await loginAdmin({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (result) {
        notifySuccess("Admin login successful");
        //router.push(redirect || "/crud");
        router.push("/crud");
      }
    } catch (error) {
      notifyError(
        error?.data?.error || "Login failed. Please check your credentials."
      );
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input
              {...register("email", { required: `Email is required!` })}
              name="email"
              id="email"
              type="email"
              placeholder="admin@example.com"
              disabled={isLoading}
            />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">Admin Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-login-input-box">
          <div className="p-relative">
            <div className="tp-login-input">
              <input
                {...register("password", { required: `Password is required!` })}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span
                className="open-eye"
                onClick={() => !isLoading && setShowPass(!showPass)}
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>
      </div>
    
      <div className="tp-login-bottom">
        <button
          type="submit"
          className="tp-login-btn w-100"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login as Admin"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
