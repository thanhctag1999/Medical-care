import { Avatar, Button, Container, Slider, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import subtaskApi from '../api/subtaskApi';
import taskApi from '../api/taskApi';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import Comment from '../components/task/Comment';
import StatusDrop from '../components/task/StatusDrop';
import { checkPermissionCreateAndDelete, checkPermissionEdit } from '../utils/checkAccess';

const isSubtask = false;

function TaskInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState();
  const [subtasks, setSubTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    try {
      const getInfo = async () => {
        const response = await taskApi.getByID(id);
        setTask(response);
        setProgress(response.progress);

        const responseSubtasks = await subtaskApi.getSubtasks(id);
        setSubTasks(responseSubtasks);
      };

      getInfo();
    } catch (err) {
      window.location.href = '/';
    }
  }, [id]);

  const onUpdateTask = async (status) => {
    const newTask = { ...task };
    newTask.status = status;

    if (status === 'Hoàn thành') {
      setProgress(100);
      newTask.progress = 100;
    }
    setTask(newTask);
    await taskApi.update(newTask, newTask._id);
  };

  const onClickSubTask = (subtaskId) => {
    navigate(`/dashboard/subtask-info/${subtaskId}`);
  };

  const handleChange = (e) => {
    setProgress(e.target.value);
    taskApi.updateProgress({ id: task._id, progress: e.target.value });
  };

  return (
    <Page title="Thông Tin Cá Nhân">
      <Container>
        {!task && <p>Không tồn tại công việc!</p>}
        {task && (
          <div className="p-8 bg-white shadow-xl rounded-2xl">
            <div className="flex justify-end">
              {checkPermissionEdit() && (
                <Link
                  to={`/dashboard/edit-task/${task._id}`}
                  className="duration-300 cursor-pointer hover:text-blue-500 no-underline text-[#333] w-fit"
                >
                  <i className="fa-solid fa-pen" /> Chỉnh Sửa
                </Link>
              )}
            </div>
            <p className="mb-8 text-2xl font-bold text-center">THÔNG TIN CÔNG VIỆC</p>
            <div className="flex">
              <div className="w-7/12 pr-2 mr-2">
                <Typography id="modal-modal-title" variant="h6" component="h2" className="text-2xl">
                  {task.topic}
                </Typography>
                <p className="mt-4 font-semibold">Tiến độ công việc: {progress}%</p>
                <Slider
                  aria-label="Progress"
                  value={progress}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  size="small"
                  onChange={handleChange}
                  disabled={task && task.status === 'Hoàn thành'}
                />
                <p className="mt-4">
                  Loại công việc: <span className="font-semibold">{task.taskType.name}</span>
                </p>
                {checkPermissionCreateAndDelete() && (
                  <Button
                    variant="outlined"
                    className="mt-4"
                    component={RouterLink}
                    to={`/dashboard/add-sub-task/${id}`}
                    startIcon={<Iconify icon="eva:checkmark-square-2-outline" />}
                  >
                    Tạo nhiệm vụ
                  </Button>
                )}
                <Typography sx={{ mt: 2 }} component={'div'}>
                  <p className="font-semibold">Nội dung</p>
                  <p>{task.content}</p>
                  <p className="mt-8 font-semibold">Ghi chú</p>
                  <p>{task.note}</p>
                  {task.link && (
                    <>
                      <p className="mt-8 font-semibold">Link hoạt động</p>
                      <a
                        href={/^http/.test(task.link) ? task.link : `https://${task.link}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {task.link}
                      </a>
                    </>
                  )}
                </Typography>
                {subtasks.length > 0 && (
                  <div>
                    <p className="mt-8 font-semibold">Nhiệm vụ</p>
                    {subtasks.map((each) => (
                      <div
                        key={each._id}
                        onClick={() => onClickSubTask(each._id)}
                        className="flex items-center justify-between w-full p-2 mt-2 duration-300 border border-gray-300 border-solid rounded-md shadow cursor-pointer hover:bg-slate-200"
                      >
                        <div className="flex w-8/12">
                          <p className="mr-2 text-blue-600 w-fit">{each.taskType.name}</p>
                          <Tooltip title={each.topic}>
                            <p className="truncate max-w-[60%]">{each.topic}</p>
                          </Tooltip>
                        </div>
                        <div className="flex items-center justify-end w-4/12 ml-4">
                          <Avatar
                            className="w-[30px] h-[30px]"
                            alt={each.user.fullName}
                            src={each.user.avatar ? process.env.REACT_APP_URL_IMG + each.user.avatar : ''}
                          />
                          <p className="ml-2 text-sm uppercase">{each.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-8 font-semibold">Hoạt động</p>
                <Comment isSubtask={isSubtask} />
              </div>

              <div className="w-5/12">
                <div className="w-full p-4 ml-2 bg-white shadow-2xl rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Chi Tiết
                    </Typography>
                    <StatusDrop status={task.status} onUpdateTaskStatus={onUpdateTask} task={task} />
                  </div>

                  <div className="flex items-center">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Người thực hiện: </p>
                    <div className="flex items-center">
                      <Avatar
                        alt={task.user.fullName}
                        src={task.user.avatar ? process.env.REACT_APP_URL_IMG + task.user.avatar : ''}
                      />
                      <span className="inline-block ml-2">{task.user.fullName}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Người giám sát: </p>
                    <div className="flex items-center">
                      <Avatar
                        alt={task.supervisor.fullName}
                        src={task.supervisor.avatar ? process.env.REACT_APP_URL_IMG + task.supervisor.avatar : ''}
                      />
                      <span className="inline-block ml-4">{task.supervisor.fullName}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Giờ G: </p>
                    <span className="inline-block px-2 py-1 ml-2 text-sm bg-gray-200 rounded-lg">{task.timeG}</span>
                  </div>
                  <div className="flex items-center mt-3 ">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Ngày bắt đầu: </p>
                    <span className="inline-block ml-2">{task.startDate.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center mt-3 ">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Ngày kết thúc: </p>
                    <span className="inline-block ml-2">{task.endDate.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center mt-3 ">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Ước tính: </p>
                    <span className="inline-block px-2 py-1 ml-2 text-sm bg-gray-200 rounded-lg">
                      {Math.floor((Date.parse(task.endDate) - Date.parse(task.startDate)) / 86400000) + 1} ngày
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-thin text-gray-500">
                    Ngày tạo công việc: {task.createdAt.slice(0, 10)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Page>
  );
}

export default TaskInfo;
