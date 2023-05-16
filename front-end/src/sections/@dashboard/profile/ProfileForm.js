import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
// material
import { DesktopDatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { FormControl, InputLabel, MenuItem, Rating, Select, Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
// component
import userApi from '../../../api/userApi';
import { updateUser } from '../../../store/slices/userSlice';
import { onOpenNotification } from '../../../utils/notificationService';
import UploadImg from '../user/UploadImg';

// ----------------------------------------------------------------------

export default function ProfileForm({ user }) {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [birthday, setBirthday] = useState(dayjs(user && user.birthday ? user.birthday : '2000-08-18'));
  const [valueRating, setValueRating] = useState(user.rating);
  const handleChangeDate = (newBirthday) => {
    setBirthday(newBirthday);
  };

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const LoginSchema = Yup.object().shape({
    fullName: Yup.string().required('Họ và tên không thể để trống!'),
    email: Yup.string().required('Email không thể để trống'),
    phoneNumber: Yup.string().required('Số điện thoại không thể để trống'),
    specialist: Yup.string().required('Chuyên khoa không thể để trống'),
    gender: Yup.string().required('Giới tính không thể để trống'),
  });

  const formik = useFormik({
    initialValues: {
      avatar: user ? user.avatar : '',
      fullName: user ? user.fullName : '',
      password: '',
      email: user ? user.email : '',
      phoneNumber: user ? user.phoneNumber : '',
      birthday: user ? user.birthday : '',
      role: user && user.role ? user.role._id : '',
      degree: user ? user.degree : '',
      link: user ? user.link : '',
      specialist: user ? user.specialist : '',
      gender: user ? user.gender : '',
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      try {
        if (images.length > 0) {
          const formData = new FormData();
          formData.append('files', images[0].file);
          formik.values.avatar = images[0].file.name;
          await userApi.uploadImg(formData);
        }
        formik.values.birthday = birthday;
        const response = await userApi.update(formik.values, user._id);
        localStorage.setItem('user', JSON.stringify(response));
        dispatch(updateUser(response));
        onOpenNotification('Cập nhật thông tin thành công !');
      } catch ({ response }) {
        // setShowError(true);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const [gender, setGender] = useState(user.gender ? user.gender : 'Nam');

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <div className="flex justify-center items-center p-8 rounded shadow-xl">
            <div className="w-4/12">
              <UploadImg onChange={onChange} images={images} user={user} />
              <Rating
                className="mt-4 flex justify-center"
                name="simple-controlled"
                readOnly
                value={valueRating}
                onChange={(event, newValue) => {
                  setValueRating(newValue);
                }}
              />
            </div>
            <div className="w-8/12 ml-6">
              <div className="flex mb-4">
                <div className="w-full">
                  <TextField
                    fullWidth
                    type="text"
                    label="Họ và Tên*"
                    {...getFieldProps('fullName')}
                    error={Boolean(touched.fullName && errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <TextField
                    fullWidth
                    type="email"
                    label="Email*"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </div>
                <div className="w-1/2 pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Số Điện Thoại*"
                    {...getFieldProps('phoneNumber')}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      label="Giới tính"
                      onChange={handleChangeGender}
                      {...getFieldProps('gender')}
                      error={Boolean(touched.gender && errors.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="Nam">Nam</MenuItem>
                      <MenuItem value="Nữ">Nữ</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="w-1/2 pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Chuyên khoa*"
                    {...getFieldProps('specialist')}
                    error={Boolean(touched.specialist && errors.specialist)}
                    helperText={touched.specialist && errors.specialist}
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        label="Ngày Sinh"
                        inputFormat="MM/DD/YYYY"
                        value={birthday}
                        onChange={() => handleChangeDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>
                <div className="w-1/2 pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Học Vị"
                    {...getFieldProps('degree')}
                    error={Boolean(touched.degree && errors.degree)}
                    helperText={touched.degree && errors.degree}
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-full pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Liên kết"
                    {...getFieldProps('link')}
                    error={Boolean(touched.link && errors.link)}
                    helperText={touched.link && errors.link}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mt-8">
                <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting} className="px-20">
                  Cập Nhật
                </LoadingButton>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
