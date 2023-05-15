import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { PropTypes } from 'prop-types';
// material
import { DesktopDatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
// component
import UploadImg from './UploadImg';
import roleApi from '../../../api/roleApi';
import userApi from '../../../api/userApi';
import authApi from '../../../api/authApi';
import { updateUser } from '../../../store/slices/userSlice';

// ----------------------------------------------------------------------

AddUserForm.protoTypes = {
  user: PropTypes.object,
};

export default function AddUserForm({ user }) {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [birthday, setBirthday] = useState(dayjs(user && user.birthday ? user.birthday : '2000-08-18'));
  const { id } = useParams();
  const isEditUser = !!id;
  const currentUser = useSelector((state) => (state.user ? state.user.user : {}));
  const dispatch = useDispatch();

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      setRoles(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (newBirthday) => {
    setBirthday(newBirthday);
  };

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const LoginSchema = Yup.object().shape({
    fullName: Yup.string().required('Họ và tên không thể để trống!'),
    username: Yup.string().required('Username không thể để trống'),
    password: !isEditUser ? Yup.string().required('Password không thể để trống') : null,
    email: Yup.string().required('Email không thể để trống'),
    phoneNumber: Yup.string().required('Số điện thoại không thể để trống'),
    officerCode: Yup.string().required('Mã cán bộ không thể để trống'),
    role: Yup.string().required('Vai trò không thể để trống'),
  });

  const formik = useFormik({
    initialValues: {
      avatar: isEditUser ? user.avatar : '',
      fullName: isEditUser ? user.fullName : '',
      username: isEditUser ? user.username : '',
      password: '',
      email: isEditUser ? user.email : '',
      phoneNumber: isEditUser ? user.phoneNumber : '',
      officerCode: isEditUser ? user.officerCode : '',
      birthday: isEditUser ? user.birthday : '',
      role: isEditUser && user.role ? user.role._id : '',
      degree: isEditUser ? user.degree : '',
      link: isEditUser ? user.link : '',
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
        if (!isEditUser) {
          await authApi.addUser(formik.values);
        } else {
          const response = await userApi.update(formik.values, user._id);
          if (id === currentUser._id) {
            dispatch(updateUser(response));
          }
        }
        navigate('/dashboard/user', { replace: true });
      } catch ({ response }) {
        // setShowError(true);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <div className="flex items-center p-8 rounded shadow-xl">
            <div className="w-4/12">
              <UploadImg onChange={onChange} images={images} user={user} />
            </div>
            <div className="w-8/12 ml-6">
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Họ và Tên*"
                    {...getFieldProps('fullName')}
                    error={Boolean(touched.fullName && errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <TextField
                    fullWidth
                    type="email"
                    label="Email*"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </div>
              </div>

              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Username*"
                    {...getFieldProps('username')}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <TextField
                    fullWidth
                    type="password"
                    disabled={isEditUser}
                    label="Password*"
                    {...getFieldProps('password')}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </div>
              </div>
              <div className="flex mb-4">
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
                <div className="w-1/2 pl-2">
                  <TextField
                    fullWidth
                    type="text"
                    label="Mã Cán Bộ*"
                    {...getFieldProps('officerCode')}
                    error={Boolean(touched.officerCode && errors.officerCode)}
                    helperText={touched.officerCode && errors.officerCode}
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
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>
                <div className="w-1/2 pl-2">
                  {roles.length > 0 && (
                    <FormControl className="w-full" error={Boolean(touched.role && errors.role)}>
                      <InputLabel>Role</InputLabel>
                      <Select label="Role" {...getFieldProps('role')} error={Boolean(touched.role && errors.role)}>
                        {roles.map((each) => (
                          <MenuItem key={each.id} value={each.id}>
                            {each.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {Boolean(touched.role && errors.role) && <FormHelperText>Vui lòng chọn vai trò !</FormHelperText>}
                    </FormControl>
                  )}
                </div>
              </div>
              <div className="flex mb-4">
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
                <div className="w-1/2 pr-2">
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
                  Submit
                </LoadingButton>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
