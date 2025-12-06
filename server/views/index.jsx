import React from 'react';
const index = ({ venues }) => {
  
  const listVenues = venues.map((item) => {
    return <li key={item.id}>{item.venue}</li>
  });

  return (
    <>
      <div>BACKEND</div>
    </>      
  )
};

export default index;