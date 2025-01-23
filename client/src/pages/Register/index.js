import React from 'react'
import { Form } from 'antd';
import Button from '../../components/Button';

function Register() {
  const onFinish = (values) => {
    console.log("Success", values);
  };

  return (
    <div className="h-screen bg-primary flex items-center justify-center ">
      <div className="authentication-form bg-white p-2">
        <h1 className='text-secondary text-2xl font-bold justify-center '>
            BOOKIFY - REGISTER
        </h1>
        <hr/>
        <Form layout="vertical" onFinish={onFinish} className='mt-1'>
          <Form.Item label="Name" name="name">
            <input type="text" placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" placeholder="Password" />
          </Form.Item>
          <div className='text-center mt-2 flex-col gap-1'>
          <Button title="Register" type="submit" color="primary"/>
            <a href='/login' className='text-primary text-sm underline '>Already have an account? Click Here To Login.</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
