import { Container, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddTypeTaskForm from '../sections/@dashboard/taskType/AddTypeTaskForm';
import taskTypeApi from '../api/taskTypeApi';
import Page from '../components/Page';

function AddNewTypeTask() {
  const { id } = useParams();
  const [typeTask, setTypeTask] = useState();
  const isEditUser = !!id;
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await taskTypeApi.getByID(id);
        setTypeTask(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (isEditUser) {
      getUser();
    }
  }, [isEditUser, id]);
  return (
    <Page title="Add New Type Task">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            {isEditUser ? 'Chỉnh Sửa Thông Tin' : 'Tạo loại công việc'}
          </Typography>
        </Stack>
        {!isEditUser || (isEditUser && typeTask) ? <AddTypeTaskForm typeTask={typeTask} /> : <p>Loading...</p>}
      </Container>
    </Page>
  );
}

export default AddNewTypeTask;
