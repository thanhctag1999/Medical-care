import { Container, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import roleApi from '../api/roleApi';
import Page from '../components/Page';
import AddRoleForm from '../sections/@dashboard/task/AddRoleForm';

function AddNewRole() {
  const { id } = useParams();
  const [role, setRole] = useState();
  const isEditUser = !!id;
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await roleApi.getByID(id);
        setRole(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (isEditUser) {
      getUser();
    }
  }, [isEditUser, id]);
  return (
    <Page title="Add New Role">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            {isEditUser ? 'Chỉnh Sửa Thông Tin' : 'Tạo Vai trò'}
          </Typography>
        </Stack>
        {!isEditUser || (isEditUser && role) ? <AddRoleForm role={role} /> : <p>Loading...</p>}
      </Container>
    </Page>
  );
}

export default AddNewRole;
