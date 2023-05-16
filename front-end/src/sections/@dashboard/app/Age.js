import React from 'react';

function Age(props) {
  const now = new Date();
  const year = now.getFullYear();
  let age;
  const { birthday } = props;
  if (birthday) {
    age = year - birthday.slice(0, 4);
  }
  return <div className="ml-2">{age && age ? `(${age})` : ''}</div>;
}

export default Age;
