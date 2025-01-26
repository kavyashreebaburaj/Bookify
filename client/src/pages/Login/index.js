import React, { useEffect } from "react";
import { Form, message, Alert } from "antd";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState(null); // State to track error

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await LoginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        setError(response.message); // Set error message
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      setError(error.message); // Set error message
      message.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen bg-primary flex items-center justify-center relative">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        />
      )}
      <div className="authentication-form bg-white p-3 rounded w-full sm:w-96">
        <h1 className="text-secondary text-2xl font-bold mb-1">
          BOOKIFY - LOGIN
        </h1>
        <hr />
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <input type="password" placeholder="Password" />
          </Form.Item>

          <div className="text-center mt-2 flex flex-col gap-1">
            <Button title="Login" type="submit" />
            <Link to="/register" className="text-primary text-sm underline">
              Don’t have an account? Click Here To Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;