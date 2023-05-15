import { Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddTaskForm from '../components/task/AddTaskForm';
import taskApi from '../api/taskApi';
import Page from '../components/Page';

function AddNewTask() {
  const { id } = useParams();
  const [task, setTask] = useState();
  const isEditUser = !!id;
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await taskApi.getByID(id);
        setTask(response);
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
            {isEditUser ? 'Chỉnh Sửa Công Việc' : 'Tạo Công Việc'}
          </Typography>
        </Stack>
        {!isEditUser || (isEditUser && task) ? <AddTaskForm task={task} /> : <p>Loading...</p>}
      </Container>
    </Page>
  );
}

export default AddNewTask;
