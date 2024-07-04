import React, {useEffect, useState , Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Select, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import DatePicker from 'components/UI/AntdDatePicker/AntdDatePicker';
import { FormTitle } from './AccountSettings.style';
import axiosInstance from 'components/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";

const AgentCreateOrUpdateForm = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    axiosInstance.get('/vendor/getProfile/').then((res)=>{
      const response = {
        "name": 'User Profile',
        "data": res.data,
      }
      setData(response);
    }).catch((err)=>{
      const response = {
        "name": 'User Profile',
        "data": "null",
      }
      setData(response);
    });
  },[])
  console.log(data)
  const userId = data ? data.data._id:'';
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  if(data){
    setValue('userName', data.data.userName);
    setValue('email', data.data.email);
    setValue('contact_no', data.data.contact_no?data.data.contact_no:'');
    setValue('address', data.data.address?data.data.address:'');
    setValue('city', data.data.city?data.data.city:'');
    setValue('state', data.data.state?data.data.state:'');
    setValue('country', data.data.country?data.data.country:'');
  }
  const onSubmit = (data) => {
    axiosInstance.put('vendor/updateProfile/'+userId,{
      'userName':data.userName,
      'email': data.email,
      'contact_no': data.contact_no,
      'address': data.address,
      'city': data.city,
      'state': data.state,
      'country': data.country
    }).then((res)=>{
      toast.success("User Profile Updated Successfully!");
      router.push("/");
    }).catch((err)=>{
      toast.error('Something went Wrong!');
    })
  }
  return (
    <Fragment>
      <FormTitle>Basic Information</FormTitle>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={30}>
          <Col lg={12} xs={24}>
            <FormControl
              label="Name"
              htmlFor="userName"
              error={errors.userName && <span>This field is required!</span>}
            >
              <Controller
                name="userName"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12} xs={24}>
          <FormControl
              label="Email"
              htmlFor="email"
              error={
                errors.email && (
                  <>
                    {errors.email?.type === 'required' && (
                      <span>This field is required!</span>
                    )}
                    {errors.email?.type === 'pattern' && (
                      <span>Please enter a valid email address!</span>
                    )}
                  </>
                )
              }
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
                    readOnly
                    type="email"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={12} xs={24}>
          <FormControl
              label="Phone number"
              htmlFor="contact_no"
              error={
                errors.contact_no && (
                  <>
                    {errors.contact_no?.type === 'required' && (
                      <span>This field is required!</span>
                    )}
                    {errors.contact_no?.type === 'pattern' && (
                      <span>Please enter your valid number!</span>
                    )}
                  </>
                )
              }
            >
              <Controller
                name="contact_no"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                  pattern: /^[0-9]*$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12} xs={24}>
          <FormControl
              label="Address"
              htmlFor="address"
              error={errors.email && <span>This field is required!</span>}
            >
              <Controller
                name="address"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={12} xs={24}>                
          <FormControl
              label="City"
              htmlFor="city"
              error={errors.email && <span>This field is required!</span>}
            >
              <Controller
                name="city"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12} xs={24}>                
          <FormControl
              label="State"
              htmlFor="state"
              error={errors.email && <span>This field is required!</span>}
            >
              <Controller
                name="state"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={24} xs={24}>               
            <FormControl
              label="Country"
              htmlFor="country"
              error={errors.email && <span>This field is required!</span>}
            >
              <Controller
                name="country"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <div className="submit-container">
          <Button htmlType="submit" type="primary">
            Save Changes
          </Button>
        </div>
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
    </Fragment>
  );
};

export default AgentCreateOrUpdateForm;
