import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useState } from 'react';
import taskApi from '../../../api/taskApi';
import TaskTable from './TaskTable';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MyTask() {
  const [value, setValue] = React.useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const currentDate = new Date();

  useEffect(() => {
    const getData = async () => {
      const response = await taskApi.getTaskByUser(currentUser._id);
      setTasks(response);
    };

    getData();
  }, [currentUser._id]);

  const todoTask = tasks.filter((each) => each.status === 'Đang chờ thực hiện');
  const inprogressTask = tasks.filter((each) => each.status === 'Đang thực hiện');
  const completedTask = tasks.filter((each) => each.status === 'Hoàn thành');
  const laterTask = tasks.filter(
    (each) =>
      (each.status === 'Đang chờ thực hiện' || each.status === 'Đang thực hiện') && new Date(each.endDate) < currentDate
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Đang chờ thực hiện" {...a11yProps(0)} />
          <Tab label="Đang thực hiện" {...a11yProps(1)} />
          <Tab label="Hoàn Thành" {...a11yProps(2)} />
          <Tab label="Trễ Hạn" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TaskTable tasks={todoTask} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TaskTable tasks={inprogressTask} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TaskTable tasks={completedTask} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TaskTable tasks={laterTask} />
      </TabPanel>
    </Box>
  );
}
