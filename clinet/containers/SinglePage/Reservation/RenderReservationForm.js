import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import HtmlLabel from 'components/UI/HtmlLabel/HtmlLabel';
import DatePickerRange from 'components/UI/DatePicker/ReactDates';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import ReservationFormWrapper, {
  FormActionArea,
  FieldWrapper,
  RoomGuestWrapper,
  ItemWrapper,
} from './Reservation.style.js';
import emailjs from 'emailjs-com';
import { Checkbox } from 'antd';
import axiosInstance from 'components/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";


// Test
const RenderReservationForm = ({ setDays }) => {
  const [formState, setFormState] = useState({
    startDate: null,
    endDate: null,
    room: 0,
    guests: 0,
    email:'',
  });
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [guestDetails, setGuestDetails] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [selectedOption , setSelectedOption] =useState('EP')


  const handleOptionChange =(e)=>{
    setSelectedOption(e.target.value);
  }

  const [primaryGuest, setPrimaryGuest] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    adharNumber: '',
    email: '',
  });


// const time =()=>{

// }

  
  const handleIncrement = (type) => {
    if (type === 'room') {
      setFormState((prevState) => ({
        ...prevState,
        [type]: prevState[type] + 1,
      }));
      // Update the total number of rooms
      setTotalRooms((prevTotalRooms) => prevTotalRooms + 1);
    } else if (type === 'guests' && formState.room > 0 && formState.guests < formState.room * 3) {
      setFormState((prevState) => ({
        ...prevState,
        [type]: prevState[type] + 1,
      }));
    }
  };

const handleDecrement = (type) => {
  setFormState((prevState) => ({
    ...prevState,
    [type]: prevState[type] <= 0 ? 0 : prevState[type] - 1,
  }));

  if (type === 'room') {
    // Decrease the total number of rooms
    setTotalRooms((prevTotalRooms) => prevTotalRooms - 1);
  }
};

  const handleIncDecOnChange = (e, type) => {
    const currentValue = e.target.value;
    setFormState((prevState) => ({
      ...prevState,
      [type]: currentValue,
    }));
  };

  const updateSearchDataFunc = (value) => {
    setFormState({
      ...formState,
      startDate: value.setStartDate,
      endDate: value.setEndDate,
    });
    calculateDays(value.setStartDate, value.setEndDate);
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    setNumberOfDays(days);
    setDays(days);
    const amountPerRoom = 5500; // Replace this with your actual amount per room
  const totalAmount = amountPerRoom * days * totalRooms;
  if(selectedOption==='CPI'){
    totalAmount +=1000 * days * totalRooms;
  }
  else if(selectedOption ==='MAP'){
    totalAmount +=2500 * days * totalRooms;
  }
  setCalculatedAmount(totalAmount);
  };
  useEffect(() => {
    calculateDays(formState.startDate, formState.endDate);
  }, [formState.startDate, formState.endDate, totalRooms,selectedOption ]);

  
  const handleGuestFieldChange = (e, index, field) => {
    const { value } = e.target;
    if (index === 0) {
      setPrimaryGuest((prevState) => ({
        ...prevState,
        [field]: value,
      }));

      // Check if the field being changed is the email field
      if (field === 'email') {
        // Update the formState with the email value
        setFormState((prevState) => ({
          ...prevState,
          email: value,
        }));
      }
    } else {
      setGuestDetails((prevState) => {
        const updatedGuests = prevState.map((guest, i) => {
          if (i === index - 1) {
            return {
              ...guest,
              [field]: value,
            };
          }
          return guest;
        });
        return updatedGuests;
      });
    }
  };

  const showModal = () => {
    if (formState.startDate && formState.endDate) {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      axiosInstance.post('vendor/bookNow/',{
        'firstName':primaryGuest.firstName,
        'lastName':primaryGuest.lastName,
        'email':primaryGuest.email,
        'mobileNumber':primaryGuest.mobileNumber,
        'adharNumber':primaryGuest.adharNumber,
        'startDate': formState.startDate,
        'endDate': formState.endDate,
        'guests': formState.guests,
        'room': formState.room,
        'guestDetails': guestDetails,
        'calculatedAmount': calculatedAmount,
        'roomType': selectedOption
      }).then((res)=>{
        toast.success(`Hotel booked successfully! and your Total Amount is ${calculatedAmount}`);
        router.push("/");
      }).catch((err)=>{
        toast.error('Something went Wrong!');
      })
      // sendEmail(primaryGuest.email);
      // alert(`Hotel booked successfully! and your Total Amount is ${calculatedAmount}`);
      setIsModalVisible(false);
      resetForm();
    } else {
      alert('Anything Missed Please Check Your Details');
    }
  };


  const isFormValid = () => {
    // Check if the required fields are filled
    if (
      !formState.startDate ||
      !formState.endDate ||
      !primaryGuest.firstName ||
      !primaryGuest.lastName ||
      !primaryGuest.mobileNumber ||
      !primaryGuest.adharNumber ||
      !primaryGuest.email
    ) {
      return false;
    }
  
    // Check mobile number format (must be 10 digits)
    if (!/^[0-9]{10}$/.test(primaryGuest.mobileNumber)) {
      return false;
    }
  
    // Check Aadhar number format (must be 12 digits)
    if (!/^[0-9]{12}$/.test(primaryGuest.adharNumber)) {
      return false;
    }
  
    // Check each guest's first name and last name
    for (let guest of guestDetails) {
      if (!guest.firstName || !guest.lastName) {
        return false;
      }
    }
  
    return true;
  };
  
  

  const sendEmail = (primaryGuestEmail) => {
    console.log(primaryGuestEmail, 'primaryGuestEmail');
    const templateParams = {
      start_date: formState.startDate ? formState.startDate.toString() : '',
      end_date: formState.endDate ? formState.endDate.toString() : '',
      rooms: formState.room.toString(),
      guests: formState.guests.toString(),
      message: `You have booked ${formState.room} room(s) with ${formState.guests} guest(s). Check-in date is ${formState.startDate} and the checkout will be ${formState.endDate} and your Number of Days stay will be ${numberOfDays} and the Booking is done by ${primaryGuest.firstName} ${primaryGuest.lastName}.`,
      primary_email: primaryGuestEmail, // Add the primary guest's email address
    };

    emailjs
      .send(
        'service_ekowvt6',
        'template_8yvpict',
        templateParams,
        '0JpNNaDU8hbhbyh_B'
      )
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
      });
  };

  const resetForm = () => {
    setFormState({
      startDate: null,
      endDate: null,
      room: 0,
      guests: 0,
    });
    setNumberOfDays(0);
    setGuestDetails([]);
    setPrimaryGuest({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      adharNumber: '',
      email: '',
    });
  };

  useEffect(() => {
  // Check if the number of guests exceeds the allowed limit
  if (formState.guests > formState.room * 3) {
    // If the number of guests is more than allowed, update it to the maximum allowed value
    setFormState((prevState) => ({
      ...prevState,
      guests: prevState.room * 3,
    }));
  }
}, [formState.room]);

  useEffect(() => {
    if (formState.guests === 1) {
      setGuestDetails([]);
    } else if (formState.guests > 1) {
      const newGuestDetails = [...guestDetails];
      if (newGuestDetails.length < formState.guests - 1) {
        const additionalGuests = formState.guests - 1 - newGuestDetails.length;
        for (let i = 0; i < additionalGuests; i++) {
          newGuestDetails.push({ firstName: '', lastName: '' });
        }
      } else if (newGuestDetails.length > formState.guests - 1) {
        newGuestDetails.splice(formState.guests - 1);
      }
      setGuestDetails(newGuestDetails);
    }
  }, [formState.guests]);


  return (
    <ReservationFormWrapper className="form-container">
      {/* <ItemWrapper>
        <h1>Offers</h1>
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="EP">EP -Single Room</option>
          <option value="CPI">CPI -With BreakFast</option>
          <option value="MAP">MAP -Lunch /dinner</option>
        </select>
      </ItemWrapper> */}
      <FieldWrapper>
        <HtmlLabel htmlFor="dates" content="Dates" />
        <DatePickerRange
          startDateId="checkin-Id"
          endDateId="checkout-id"
          startDatePlaceholderText="Check In"
          endDatePlaceholderText="Check Out"
          updateSearchData={(value) => updateSearchDataFunc(value)}
          numberOfMonths={1}
          small
        />
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="guests" content="Guests" />
        <ViewWithPopup
          key={200}
          noView={true}
          className={formState.room || formState.guests ? 'activated' : ''}
          view={
            <Button type="default">
              <span>Room {formState.room > 0 && `: ${formState.room}`}</span>
              <span>-</span>
              <span>Guests {formState.guests > 0 && `: ${formState.guests}`}</span>
            </Button>
          }
          popup={
            <RoomGuestWrapper>
              <ItemWrapper>
                <strong>Room</strong>
                <InputIncDec
                  id="room"
                  increment={() => handleIncrement('room')}
                  decrement={() => handleDecrement('room')}
                  onChange={(e) => handleIncDecOnChange(e, 'room')}
                  value={formState.room}
                />
              </ItemWrapper>

              <ItemWrapper>
                <strong>Guests</strong>
                <InputIncDec
                  id="guests"
                  increment={() => handleIncrement('guests')}
                  decrement={() => handleDecrement('guests')}
                  onChange={(e) => handleIncDecOnChange(e, 'guests')}
                  value={formState.guests}
                />
              </ItemWrapper>
            </RoomGuestWrapper>
          }
        />
      </FieldWrapper>
      <p>Number of days: {numberOfDays}</p>
      <p>Number of Room :{totalRooms}</p>
      <p>Total amount :{calculatedAmount}</p>
      <p>category : </p>
      <ItemWrapper >
        <select style={{alignItems:'left'}} value={selectedOption} onChange={handleOptionChange}>
          <option value="EP">EP -Single Room</option>
          <option value="CPI">CPI-Room With BreakFast</option>
          <option value="MAP">MAP -Room with BreakFast and Lunch/Dinner </option>
        </select>
      </ItemWrapper>
      <FormActionArea>
        <Button
          htmlType="button"
          type="primary"
          onClick={showModal}
          disabled={!formState.startDate || !formState.endDate}
        >
          Book Hotel
        </Button>
      </FormActionArea>
      <Modal
        title="Guest Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText="Submit"
      >
        <Form>
          <Form.Item
            label="Primary Guest First Name"
            rules={[{ required: true, message: 'Please enter the primary guest first name.' }]}
            
          >
            <Input
              value={primaryGuest.firstName}
              onChange={(e) => handleGuestFieldChange(e, 0, 'firstName')}
              pattern="[A-Za-z]+"
              title="Only alphabetic characters are allowed"
            />
          </Form.Item>
          <Form.Item
            label="Primary Guest Last Name"
            rules={[{ required: true, message: 'Please enter the primary guest last name.' }]}
          >
            <Input
              value={primaryGuest.lastName}
              onChange={(e) => handleGuestFieldChange(e, 0, 'lastName')}
              pattern="[A-Za-z]+"
              title="Only alphabetic characters are allowed"
            />
          </Form.Item>
<Form.Item
  label="Primary Guest Mobile Number"
  rules={[
    { required: true, message: 'Please enter the primary guest mobile number.' },
    {
      pattern: /^[0-9]{10}$/,
      message: 'Mobile number must be 10 digits.',
    },
  ]}
>
  <Input
    value={primaryGuest.mobileNumber}
    onChange={(e) => handleGuestFieldChange(e, 0, 'mobileNumber')}
    maxLength={10}
  />
</Form.Item>

<Form.Item
  label="Primary Guest Adhar Number"
  rules={[
    { required: true, message: 'Please enter the primary guest Aadhar number.' },
    {
      pattern: /^[0-9]{12}$/,
      message: 'Aadhar number must be 12 digits.',
    },
  ]}
>
  <Input
    value={primaryGuest.adharNumber}
    onChange={(e) => handleGuestFieldChange(e, 0, 'adharNumber')}
    maxLength={12} 
  />
</Form.Item>

<Form.Item
  label="Primary Guest Email"
  rules={[
    { required: true, message: 'Please enter the primary guest email.' },
    {
      type: 'email',
      message: 'Please enter a valid email address.',
    },
  ]}
>
  <Input
    value={primaryGuest.email}
    onChange={(e) => handleGuestFieldChange(e, 0, 'email')}
    type="email"
  />
</Form.Item>
          {guestDetails.map((guest, index) => (
            <div key={`guest-${index}`}>
              <h3>Guest {index + 1}</h3>
              <Form.Item
                label="First Name"
                rules={[{ required: true, message: 'Please enter the guest first name.' }]}
              >
                <Input
                  value={guest.firstName}
                  onChange={(e) => handleGuestFieldChange(e, index + 1, 'firstName')}
                  pattern="[A-Za-z]+"
                  title="Only alphabetic characters are allowed"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                rules={[{ required: true, message: 'Please enter the guest last name.' }]}
              >
                <Input
                  value={guest.lastName}
                  onChange={(e) => handleGuestFieldChange(e, index + 1, 'lastName')}
                  pattern="[A-Za-z]+"
                  title="Only alphabetic characters are allowed"
                />
              </Form.Item>
            </div>
          ))}
        </Form>
      </Modal>
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
    </ReservationFormWrapper>
  );
};

export default RenderReservationForm;