import { Container, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AddUserForm from '../sections/@dashboard/user/AddUserForm';
import Page from '../components/Page';
import userApi from '../api/userApi';

function AddNewUser() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const isEditUser = !!id;
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await userApi.getByID(id);
        setUser(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (isEditUser) {
      getUser();
    }
  }, [isEditUser, id]);
  return (
    <Page title="Add New User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            {isEditUser ? 'Chỉnh Sửa Thông Tin' : 'Tạo Người Dùng'}
          </Typography>
        </Stack>
        {!isEditUser || (isEditUser && user) ? <AddUserForm user={user} /> : <p>Loading...</p>}
      </Container>
    </Page>
  );
}

export default AddNewUser;
