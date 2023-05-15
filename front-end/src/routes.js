import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import AddNewTask from './pages/AddNewTask';
import AddNewUser from './pages/AddNewUser';
import DashboardApp from './pages/DashboardApp';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Task from './pages/Task';
import User from './pages/User';
import Role from './pages/Role';
import Profile from './pages/Profile';
import AddNewRole from './pages/AddNewRole';
import TaskInfo from './pages/TaskInfo';
import TypeTask from './pages/TypeTask';
import AddNewTypeTask from './pages/AddNewTypeTask';
import AddNewSubTask from './pages/AddNewSubTask';
import SubtaskInfo from './pages/SubtaskInfo';
import StatisticalTask from './pages/StatisticalTask';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'profile', element: <Profile /> },
        { path: 'add-new-user', element: <AddNewUser /> },
        { path: 'edit-user/:id', element: <AddNewUser /> },
        { path: 'task', element: <Task /> },
        { path: 'role', element: <Role /> },
        { path: 'add-new-role', element: <AddNewRole /> },
        { path: 'edit-role/:id', element: <AddNewRole /> },
        { path: 'type-task', element: <TypeTask /> },
        { path: 'add-new-typetask', element: <AddNewTypeTask /> },
        { path: 'edit-typetask/:id', element: <AddNewTypeTask /> },
        { path: 'add-new-task', element: <AddNewTask /> },
        { path: 'add-sub-task/:id', element: <AddNewSubTask /> },
        { path: 'edit-subtask/:id/subtask/:subtaskId', element: <AddNewSubTask /> },
        { path: 'edit-task/:id', element: <AddNewTask /> },
        { path: 'task-info/:id', element: <TaskInfo /> },
        { path: 'subtask-info/:id', element: <SubtaskInfo /> },
        { path: 'statistical-task', element: <StatisticalTask /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
