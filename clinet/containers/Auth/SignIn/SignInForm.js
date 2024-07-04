import React, { useContext, Fragment } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FORGET_PASSWORD_PAGE } from 'settings/constant';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';
import axiosInstance from 'components/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";

export default function SignInForm() {
  const { signIn } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const router = useRouter();
  const onSubmit = (data) => {
    // signIn(data);
    // console.log(data);
    axiosInstance.post('auth/login',{
      'email': data.email,
      'password': data.password
    }).then((res)=>{
      // console.log(res);
      localStorage.setItem('token',res.data.token);
      localStorage.setItem('email',res.data.email);
      localStorage.setItem('userId',res.data.id);
      localStorage.setItem('type',res.data.type);
      toast.success("Login Successfully!");
      if(res.data.type == 'Vendor')
      {
        const UserData = {
          id: res.data.id,
          name: res.data.userName,
          avatar: 'http://s3.amazonaws.com/redqteam.com/isomorphic-reloaded-image/profilepic.png',
          roles: ['ADMIN'],
        };        
        signIn(UserData);
      }
      else
      {
        const UserData = {
          id: res.data.id,
          name: res.data.userName,
          avatar: 'http://s3.amazonaws.com/redqteam.com/isomorphic-reloaded-image/profilepic.png',
          roles: ['USER'],
        };        
        signIn(UserData);
      }
      router.push("/");

    }).catch((err)=>{
      console.log(err);
      toast.error(err.response.data.message);
      return err;
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          label="Email"
          htmlFor="email"
          error={errors.email && (
            <Fragment>
              {errors.email?.type === 'required' && (
                <span>This field is required!</span>
              )}
              {errors.email?.type === 'pattern' && (
                <span>Please enter a valid email address!</span>
              )}
            </Fragment>
          )}
        >
          <Controller
            name="email"
            defaultValue=""
            control={control}
            rules={{
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                type="email"
                onChange={onChange}
                onBlur={onBlur}
                value={value} />
            )} />
        </FormControl>
        <FormControl
          label="Password"
          htmlFor="password"
          error={errors.password && (
            <Fragment>
              {errors.password?.type === 'required' && (
                <span>This field is required!</span>
              )}
              {errors.password?.type === 'minLength' && (
                <span>Password must be at lest 6 characters!</span>
              )}
              {errors.password?.type === 'maxLength' && (
                <span>Password must not be longer than 20 characters!</span>
              )}
            </Fragment>
          )}
        >
          <Controller
            name="password"
            defaultValue=""
            control={control}
            rules={{ required: true, minLength: 6, maxLength: 20 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.Password onChange={onChange} onBlur={onBlur} value={value} />
            )} />
        </FormControl>
        <FieldWrapper>
          <SwitchWrapper>
            <Controller
              control={control}
              name="rememberMe"
              valueName="checked"
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <Switch onChange={onChange} checked={value} />
              )} />
            <Label>Remember Me</Label>
          </SwitchWrapper>
          <Link href={FORGET_PASSWORD_PAGE}>
            <a>Forget Password ?</a>
          </Link>
        </FieldWrapper>
        <Button
          className="signin-btn"
          type="primary"
          htmlType="submit"
          size="large"
          style={{ width: '100%' }}
        >
          <MdLockOpen />
          Login
        </Button>
      </form>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover />
    </>
  );
}
