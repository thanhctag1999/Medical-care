// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Trang chủ',
    path: '/dashboard/app',
    icon: getIcon('material-symbols:team-dashboard'),
  },
  {
    title: 'Chuyên khoa',
    path: '/dashboard/user',
    icon: getIcon('material-symbols:diamond-outline-rounded'),
  },
  {
    title: 'Chế độ ăn uống',
    path: '/dashboard/task',
    icon: getIcon('mdi:food-apple'),
  },
  {
    title: 'Lịch hẹn',
    path: '/dashboard/role',
    icon: getIcon('material-symbols:auto-schedule-rounded'),
  },
  {
    title: 'Forum',
    path: '/dashboard/type-task',
    icon: getIcon('material-symbols:forum-rounded'),
  },
  {
    title: 'Liên kết ngân hàng',
    path: '/dashboard/statistical-task',
    icon: getIcon('cib:samsung-pay'),
  },
];

export default navConfig;
