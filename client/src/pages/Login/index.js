import React from 'react'
import { Form, message } from 'antd';
import Button from '../../components/Button';
import { LoginUser } from '../../apicalls/users';

function Login() {
  const onFinish = async(values) => {
    try {
      const response = await LoginUser(values);
      if(response.success){
        message.success(response.message);
        alert(`Success: ${response.message}`);
        localStorage.setItem("token",response.data);
        window.location.href="/";
      }else{
        message.error(response.message);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      message.error(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="h-screen bg-primary flex items-center justify-center ">
      <div className="authentication-form bg-white p-2">
        <h1 className='text-secondary text-2xl font-bold justify-center '>
            BOOKIFY - LOGIN
        </h1>
        <hr/>
        <Form layout="vertical" onFinish={onFinish} className='mt-1'>
          {/* <Form.Item label="Name" name="name">
            <input type="text" placeholder="Name" />
          </Form.Item> */}
          <Form.Item label="Email" name="email">
            <input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" placeholder="Password" />
          </Form.Item>
          
          <div className='text-center mt-2 flex-col gap-1'>
          <Button title="Login" type="submit" color="primary"/>
            <a href='/register' className='text-primary text-sm underline '>Dont have an account? Click Here To Register.</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
