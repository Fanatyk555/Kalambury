import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  let today = new Date();
  let year = today.getFullYear();
  return(
    <footer className="row align-items-center">
      <small>
        &copy; Copyright {year}. All Rights Reserved
      </small>
    </footer>
  )
}

export default Footer;