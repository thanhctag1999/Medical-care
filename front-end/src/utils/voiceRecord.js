import dayjs from 'dayjs';
import moment from 'moment/moment';

export const keywords = [
  'chủ đề',
  'người thực hiện',
  'người giám sát',
  'loại công việc',
  'giờ',
  'nội dung',
  'ngày bắt đầu',
  'ngày kết thúc',
];

export const FIELDS = ['topic', 'user', 'supervisor', 'taskType', 'timeG', 'content', 'startDate', 'endDate'];

export const FIELD_RECORD = {
  topic: 'topic',
  worker: 'user',
  supervisor: 'supervisor',
  taskType: 'taskType',
  timeG: 'timeG',
  content: 'content',
  startDate: 'startDate',
  endDate: 'endDate',
};

const continueKeyword = 'tiếp theo';
const LENGTH_VALID_STRING_DATE = 24;
const LENGTH_INVALID_STRING_DATE = 30;

const isExistedKeyword = (keyword, transcript) => transcript.indexOf(keyword) >= 0;

export const hasExistKeyWord = (transcript, isSubtask = false) => {
  let fieldSelected = '';
  keywords[0] = isSubtask ? 'nhiệm vụ' : 'chủ đề';
  for (let index = 0; index < keywords.length; index += 1) {
    if (isExistedKeyword(keywords[index], transcript)) {
      fieldSelected = FIELDS[index];
      break;
    }
  }
  return fieldSelected;
};

const convertDateByString = (string) => {
  let isValidDate = true;
  let date = null;

  if (string.length >= LENGTH_VALID_STRING_DATE) {
    const idxDay = string.indexOf('ngày ');
    const idxMonth = string.indexOf('tháng ');
    const idxYear = string.indexOf('năm ');
    if (idxDay >= 0 && idxMonth > 0 && idxYear > 0) {
      const day = Number(string.substr(idxDay + 5, 2));
      const month = Number(string.substr(idxMonth + 6, 2));
      const year = Number(string.substr(idxYear + 4, 4));
      try {
        const parseDate = moment(`${day}/${month}/${year}`, 'DD-MM-YYYY');
        isValidDate = parseDate.isValid() && year >= new Date().getFullYear();
        if (isValidDate) {
          date = dayjs(parseDate);
        }
      } catch (err) {
        isValidDate = false;
      }
    }
  }

  return { isValidDate, date };
};

const getTaskTypeId = (taskTypes, transcript) => {
  const result = taskTypes.find((x) => transcript.toLowerCase().indexOf(x.name.toLocaleLowerCase()) >= 0);
  return result ? result._id : null;
};

const getUserId = (users, transcript) => {
  const result = users.find((x) => transcript.toLowerCase().indexOf(x.fullName.toLocaleLowerCase()) >= 0);
  return result ? result._id : null;
};

const parseTime = (timeG) => (Number(timeG) > 0 ? Number(timeG) : 0);

export const getFieldValue = (fieldRecord, transcript, users, supervisors, taskTypes) => {
  let result = null;
  let resetFieldRecord = true;

  if (fieldRecord === FIELD_RECORD.worker || fieldRecord === FIELD_RECORD.supervisor) {
    result = getUserId(fieldRecord === FIELD_RECORD.worker ? users : supervisors, transcript);
  } else if (fieldRecord === FIELD_RECORD.taskType) {
    result = getTaskTypeId(taskTypes, transcript);
  } else if (fieldRecord === FIELD_RECORD.endDate || fieldRecord === FIELD_RECORD.startDate) {
    const { isValidDate, date } = convertDateByString(transcript.toLocaleLowerCase());
    result = isValidDate ? date : null;

    if (transcript.length >= LENGTH_INVALID_STRING_DATE) {
      resetFieldRecord = true;
      result = ' ';
    }
  } else {
    result = transcript.replace(continueKeyword, '').replace('tiếp', '').replace('theo', '');
    resetFieldRecord = false;

    if (fieldRecord === FIELD_RECORD.timeG) {
      result = parseTime(result);
      resetFieldRecord = true;
    }
  }

  return {
    value: result,
    isResetFieldRecord: resetFieldRecord,
  };
};
