import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
// material
import { DesktopDatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
// component
import userApi from '../../../api/userApi';
import { updateUser } from '../../../store/slices/userSlice';
import { onOpenNotification } from '../../../utils/notificationService';
import UploadImg from '../user/UploadImg';

// ----------------------------------------------------------------------

export default function PatientRecord({ user }) {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [date, setDate] = useState(dayjs(user && user.date ? user.date : '2000-08-18'));

  const handleChange = (newDate) => {
    setDate(newDate);
  };

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const LoginSchema = Yup.object().shape({
    fullName: Yup.string().required('Họ và tên không thể để trống!'),
    email: Yup.string().required('Email không thể để trống'),
    phoneNumber: Yup.string().required('Số điện thoại không thể để trống'),
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
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      //   Nothing
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <div className="flex items-center p-8 rounded shadow-xl">
            <div className="w-full ml-6">
              <div className="flex mb-4">
                <div className="w-full">
                  <TextField fullWidth type="text" label="Họ và Tên*" />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        label="Ngày Sinh"
                        inputFormat="MM/DD/YYYY"
                        value={date}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>
                <div className="w-1/2 pr-2">
                  <TextField fullWidth type="text" label="Giới tính" />
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full pr-2">
                  <TextField fullWidth type="text" label="Tiền sử bệnh" multiline rows={4} />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-full pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Triệu chứng"
                    {...getFieldProps('link')}
                    error={Boolean(touched.link && errors.link)}
                    helperText={touched.link && errors.link}
                  />
                </div>
              </div>
              <div className="w-full">
                <UploadImg onChange={onChange} images={images} user={user} />
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
