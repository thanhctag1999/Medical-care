import { Avatar, Container, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { checkPermissionEdit } from '../utils/checkAccess';
import subtaskApi from '../api/subtaskApi';
import Page from '../components/Page';
import Comment from '../components/task/Comment';
import StatusDrop from '../components/task/StatusDrop';

const isSubtask = true;

function SubTaskInfo() {
  const { id } = useParams();
  const [subtask, setSubTask] = useState();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const getInfo = async () => {
        const responseSubtasks = await subtaskApi.getByID(id);
        setSubTask(responseSubtasks);
        setProgress(responseSubtasks.progress);
      };
      getInfo();
    } catch (error) {
      window.location.href = '/';
    }
  }, [id]);

  const onUpdateTask = async (status) => {
    const newTask = { ...subtask };
    newTask.status = status;

    if (status === 'Hoàn thành') {
      setProgress(100);
      newTask.progress = 100;
    }
    setSubTask(newTask);

    await subtaskApi.update(newTask, newTask._id);
  };

  const handleChange = (e) => {
    setProgress(e.target.value);
    subtaskApi.updateProgress({ id: subtask._id, progress: e.target.value });
  };

  return (
    <Page title="Thông Tin Cá Nhân">
      <Container>
        {!subtask && <p>Không tồn tại nhiệm vụ!</p>}

        {subtask && (
          <div className="p-8 bg-white shadow-xl rounded-2xl">
            <div className="flex justify-between">
              <Link
                to={`/dashboard/task-info/${subtask.task}`}
                className="duration-300 cursor-pointer hover:text-blue-500 no-underline text-[#333] w-fit"
              >
                <i className="fa-solid fa-chevron-left" /> Quay lại
              </Link>
              {checkPermissionEdit() && (
                <Link
                  to={`/dashboard/edit-subtask/${subtask.task}/subtask/${subtask._id}`}
                  className="duration-300 cursor-pointer hover:text-blue-500 no-underline text-[#333] w-fit"
                >
                  <i className="fa-solid fa-pen" /> Chỉnh Sửa
                </Link>
              )}
            </div>
            <p className="mb-8 text-2xl font-bold text-center">THÔNG TIN NHIỆM VỤ</p>
            <div className="flex">
              <div className="w-7/12 pr-2 mr-2">
                <Typography id="modal-modal-title" variant="h6" component="h2" className="text-2xl">
                  {subtask.topic}
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
                  disabled={subtask && subtask.status === 'Hoàn thành'}
                />
                <p className="mt-4">
                  Loại công việc: <span className="font-semibold">{subtask.taskType.name}</span>
                </p>
                <Typography sx={{ mt: 2 }} component={'div'}>
                  <p className="font-semibold">Nội dung</p>
                  <p>{subtask.content}</p>
                  <p className="mt-8 font-semibold">Ghi chú</p>
                  <p>{subtask.note}</p>
                  {subtask.link && (
                    <>
                      <p className="mt-8 font-semibold">Link hoạt động</p>
                      <a
                        href={/^http/.test(subtask.link) ? subtask.link : `https://${subtask.link}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {subtask.link}
                      </a>
                    </>
                  )}
                </Typography>
                <p className="mt-8 font-semibold">Hoạt động</p>
                <Comment isSubtask={isSubtask} />
              </div>

              <div className="w-5/12">
                <div className="w-full p-4 ml-2 bg-white shadow-2xl rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Chi Tiết
                    </Typography>
                    <StatusDrop status={subtask.status} onUpdateTaskStatus={onUpdateTask} task={subtask} />
                  </div>

                  <div className="flex items-center">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Người thực hiện: </p>
                    <div className="flex items-center">
                      <Avatar
                        alt={subtask.user.fullName}
                        src={subtask.user.avatar ? process.env.REACT_APP_URL_IMG + subtask.user.avatar : ''}
                      />
                      <span className="inline-block ml-2">{subtask.user.fullName}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Người giám sát: </p>
                    <div className="flex items-center">
                      <Avatar
                        alt={subtask.supervisor.fullName}
                        src={subtask.supervisor.avatar ? process.env.REACT_APP_URL_IMG + subtask.supervisor.avatar : ''}
                      />
                      <span className="inline-block ml-4">{subtask.supervisor.fullName}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Giờ G: </p>
                    <span className="inline-block px-2 py-1 ml-2 text-sm bg-gray-200 rounded-lg">{subtask.timeG}</span>
                  </div>
                  <div className="flex items-center mt-3 ">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Ngày bắt đầu: </p>
                    <span className="inline-block ml-2">{subtask.startDate.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center mt-3 ">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Ngày kết thúc: </p>
                    <span className="inline-block ml-2">{subtask.endDate.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center mt-3 ">
                    <p className="w-1/2 text-sm font-bold text-gray-500">Ước tính: </p>
                    <span className="inline-block px-2 py-1 ml-2 text-sm bg-gray-200 rounded-lg">
                      {Math.floor((Date.parse(subtask.endDate) - Date.parse(subtask.startDate)) / 86400000) + 1} ngày
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-thin text-gray-500">
                    Ngày tạo công việc: {subtask.createdAt.slice(0, 10)}
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

export default SubTaskInfo;
