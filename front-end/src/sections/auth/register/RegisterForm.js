import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
// material
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
// component
import authApi from '../../../api/authApi';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Phải ít nhất 2 ký tự!')
      .max(50, 'Tối đa 50 ký tự!')
      .required('Họ không được để trống'),
    lastName: Yup.string()
      .min(2, 'Phải ít nhất 2 ký tự!')
      .max(50, 'Tối đa 50 ký tự!')
      .required('Tên không được để trống'),
    email: Yup.string().email('Email không đúng định dạng').required('Email không hợp lệ'),
    password: Yup.string().required('Password không hợp lệ'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async () => {
      try {
        const data = {
          fullName: `${formik.values.firstName} ${formik.values.lastName}`,
          email: formik.values.email,
          password: formik.values.password,
        };
        const response = await authApi.register(data);
        if (response.status === 200) {
          resetForm();
          setShowError(false);
          setShowSuccess(true);
          setInterval(() => {
            setShowSuccess(false);
          }, 3000);
        }
      } catch ({ response }) {
        setShowSuccess(false);
        setShowError(true);
        setInterval(() => {
          setShowError(false);
        }, 3000);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {showError && <p className="text-red-500 mb-4">Email đã được sử dụng!</p>}
        {showSuccess && <p className="text-green-500 mb-4">Đăng ký tài khoản thành cống!</p>}
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Họ"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Tên"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Đăng ký
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
