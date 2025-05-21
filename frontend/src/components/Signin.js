import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginThunk } from "../redux/slices/userslice";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Signin() {
  const { isLoggedIn, errStatus, errmsg, isPending } = useSelector((state) => state.userReducer);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function submit(userCredObj) {
    dispatch(userLoginThunk(userCredObj));
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 border-0 m-3" style={{ width: "380px", borderRadius: "10px" }}>
        <h2 className="text-center text-primary mb-4 ">Sign In</h2>

        {errStatus && (
          <div className="alert alert-danger text-center py-2">{errmsg}</div>
        )}

        {/* Email Input */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white"><FaEnvelope className="text-secondary" /></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && <small className="text-danger">{errors.email.message}</small>}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white"><FaLock className="text-secondary" /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSubmit(submit)}
          disabled={isPending}
          style={{ borderRadius: "8px", transition: "0.3s" }}
        >
          {isPending ? "Logging in..." : "LOGIN"}
        </button>

        <p className="text-center mt-3">
          <small>New here? </small>
          <Link to="/signup1" className="text-primary fw-bold text-decoration-underline">
            SignUp Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
