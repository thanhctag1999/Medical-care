// material
import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// component
import taskTypeApi from '../../../api/taskTypeApi';

// ----------------------------------------------------------------------

AddTypeTaskForm.protoTypes = {
  user: PropTypes.object,
};

export default function AddTypeTaskForm({ typeTask }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditUser = !!id;

  const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Tên loại công việc không thể để trống!'),
  });

  const formik = useFormik({
    initialValues: {
      name: isEditUser && typeTask ? typeTask.name : '',
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      try {
        if (!isEditUser) {
          await taskTypeApi.addRole(formik.values);
        } else {
          await taskTypeApi.update(formik.values, typeTask._id);
        }
        navigate('/dashboard/type-task', { replace: true });
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
            <div className="w-8/12 ml-6">
              <div className="pr-2 w-100">
                <TextField
                  fullWidth
                  type="text"
                  label="Tên loại công việc*"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
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
