import React, { useEffect } from "react";
import { Form, message, Alert } from "antd";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState(null); // State to track error

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await RegisterUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
          message={error}
          type="error"
          showIcon
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: "80%", // Adjust width to keep it on one line, or customize as needed
            maxWidth: "600px", // Max width to prevent the alert from being too wide
            whiteSpace: "nowrap", // Ensure message stays in one line
            overflow: "hidden", // Hide overflow text
            textOverflow: "ellipsis", // Show ellipsis if the message is too long
          }}
        />
      )}
      <div className="authentication-form bg-white p-3 rounded w-full sm:w-96">
        <h1 className="text-secondary text-2xl font-bold mb-1">
          BOOKIFY - REGISTER
        </h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <input type="text" placeholder="Name" />
          </Form.Item>
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
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <input type="number" placeholder="Phone Number" />
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
            <Button title="Register" type="submit" />
            <Link to="/login" className="text-primary text-sm underline">
              Already have an account? Click Here To Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;