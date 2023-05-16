import React from 'react';
import { useSelector } from 'react-redux';

function Degree() {
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      {user.certificate && (
        <img className="w-1/2 h-1/2 block m-auto" src={process.env.REACT_APP_URL_IMG + user.certificate} alt="" />
      )}
    </div>
  );
}

export default Degree;
