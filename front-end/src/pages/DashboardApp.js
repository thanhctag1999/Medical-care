// @mui
import { Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import roleApi from '../api/roleApi';
import taskApi from '../api/taskApi';
import taskTypeApi from '../api/taskTypeApi';
import userApi from '../api/userApi';

// components
import Page from '../components/Page';
// sections
import { AppConversionRates, AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from '../sections/@dashboard/app';
import LateTask from '../sections/@dashboard/app/LateTask';

// ----------------------------------------------------------------------

const countDataInYear = (array) => {
  const data = [];
  for (let index = 1; index <= 12; index += 1) {
    data.push(array.filter((e) => parseInt(e.createdAt.substring(5, 7), 10) === index).length);
  }
  return data;
};

export default function DashboardApp() {
  const theme = useTheme();
  const [tasks, setTask] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskType, setTaskType] = useState([]);
  const [roles, setRoles] = useState([]);

  const taskInYear = countDataInYear(tasks);
  const userInYear = countDataInYear(users);
  const taskWaiting = tasks.filter((e) => e.status === 'Đang chờ thực hiện').length;
  const taskDoing = tasks.filter((e) => e.status === 'Đang thực hiện').length;
  const taskFinish = tasks.filter((e) => e.status === 'Hoàn thành').length;
  const taskCancel = tasks.filter((e) => e.status === 'Hủy bỏ').length;

  useEffect(() => {
    const fetchTask = async () => {
      const response = await taskApi.getAll();
      setTask(response);
    };
    const fetchUsers = async () => {
      const responseUser = await userApi.getAll();
      setUsers(responseUser);
    };
    const fetchTaskType = async () => {
      const response = await taskTypeApi.getTaskTypes();
      setTaskType(response);
    };
    const fetchRoles = async () => {
      const response = await roleApi.getAll();
      setRoles(response);
    };

    fetchTask();
    fetchUsers();
    fetchRoles();
    fetchTaskType();
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Link className="no-underline" to="/dashboard/task">
              <AppWidgetSummary
                title="Công việc"
                total={tasks.length}
                color="success"
                icon={'ant-design:code-sandbox-outlined'}
              />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link className="no-underline" to="/dashboard/user">
              <AppWidgetSummary title="Người dùng" total={users.length} icon={'ant-design:user-outlined'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link className="no-underline" to="/dashboard/role">
              <AppWidgetSummary
                title="Vai trò"
                total={roles.length}
                color="warning"
                icon={'ant-design:star-outlined'}
              />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link className="no-underline" to="/dashboard/type-task">
              <AppWidgetSummary
                title="Loại công việc"
                total={taskType.length}
                color="error"
                icon={'ant-design:appstore-outlined'}
              />
            </Link>
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <LateTask title="Thống kê công việc trễ hạn" subheader="Số lượng công việc sắp đến hạn" tasks={tasks} />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title="Thống kê số lượng công việc và người dùng"
              subheader="trong năm 2022"
              chartLabels={[
                '01/01/2022',
                '02/01/2022',
                '03/01/2022',
                '04/01/2022',
                '05/01/2022',
                '06/01/2022',
                '07/01/2022',
                '08/01/2022',
                '09/01/2022',
                '10/01/2022',
                '11/01/2022',
                '12/01/2022',
              ]}
              chartData={[
                {
                  name: 'Công việc',
                  type: 'column',
                  fill: 'solid',
                  data: taskInYear,
                },
                {
                  name: 'Người dùng',
                  type: 'area',
                  fill: 'gradient',
                  data: userInYear,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Thống kê tiến độ công việc"
              subheader="trên tổng số lượng công việc"
              chartData={[
                { label: 'Đang chờ thực hiện', value: taskWaiting },
                { label: 'Đang thực hiện', value: taskDoing },
                { label: 'Hoàn thành', value: taskFinish },
                { label: 'Hủy bỏ', value: taskCancel },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Thống kê danh mục"
              chartData={[
                { label: 'Công việc', value: tasks.length },
                { label: 'Người dùng', value: users.length },
                { label: 'Vai trò', value: roles.length },
                { label: 'Loại công việc', value: taskType.length },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.green[0],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
