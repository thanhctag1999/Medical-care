import { Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddSubTaskForm from '../components/task/AddSubTaskForm';
import taskApi from '../api/taskApi';
import subtaskApi from '../api/subtaskApi';
import Page from '../components/Page';

function AddNewSubTask() {
  const { id, subtaskId } = useParams();
  const [task, setTask] = useState();
  const [subtask, setSubTask] = useState();
  const isEditUser = !!subtaskId;
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await taskApi.getByID(id);
        setTask(response);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [id]);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await subtaskApi.getByID(subtaskId);
        setSubTask(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (subtaskId) getData();
  }, [subtaskId]);
  return (
    <Page title="Add New User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            {isEditUser ? 'Chỉnh Sửa Nhiệm Vụ' : 'Tạo Nhiệm vụ'}
          </Typography>
        </Stack>
        {(!isEditUser && task) || (isEditUser && task && subtask) ? (
          <AddSubTaskForm task={task} subtask={subtask} />
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </Page>
  );
}

export default AddNewSubTask;
