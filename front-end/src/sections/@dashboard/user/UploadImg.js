import { Button } from '@mui/material';
import ImageUploading from 'react-images-uploading';
import PropTypes from 'prop-types';

UploadImg.propTypes = {
  onChange: PropTypes.func,
  images: PropTypes.array,
  user: PropTypes.object,
};

export default function UploadImg({ onChange, images, user }) {
  const maxNumber = 69;
  const onChangeImg = (imageList) => {
    onChange(imageList);
  };

  return (
    <ImageUploading value={images} onChange={onChangeImg} maxNumber={maxNumber} dataURLKey="data_url">
      {({ imageList, onImageUpload, onImageUpdate, dragProps }) => (
        <div className="flex flex-col items-center justify-center w-full upload__image-wrapper">
          {(!user || (user && !user.avatar)) && imageList.length === 0 && (
            <Button
              className="w-[150px] h-[150px] rounded-full bg-gray-200"
              type="button"
              variant="outlined"
              component="span"
              onClick={onImageUpload}
              {...dragProps}
            >
              <span className="flex flex-col items-center justify-center">
                <i className="text-2xl fa-solid fa-camera-retro" />
                <span>Upload Photo</span>
              </span>
            </Button>
          )}
          {imageList.map((image, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <img
                className="w-[150px] h-[150px] rounded-full cursor-pointer object-cover"
                src={image.data_url}
                alt=""
                onClick={() => onImageUpdate(index)}
              />
              <p className="mt-4 text-sm text-gray-600">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
            </div>
          ))}
          {imageList.length === 0 && user && user.avatar && (
            <div className="flex flex-col items-center justify-center">
              <img
                className="w-[150px] h-[150px] rounded-full cursor-pointer object-cover"
                src={process.env.REACT_APP_URL_IMG + user.avatar}
                alt=""
                onClick={() => onImageUpdate(0)}
              />
              <p className="mt-4 text-sm text-gray-600">Cho phép định dạng *.jpeg, *.jpg, *.png, *.gif</p>
            </div>
          )}
        </div>
      )}
    </ImageUploading>
  );
}
