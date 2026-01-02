import React from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
  <nav className= "navbar">
    <Link to= "/">
    <p className="text-2xl font-bold text-gradient">RESUMIND</p>
    </Link>
    <Link to= "/upload" className="primaryButton w-fit  px-4 py-1 bg-indigo-400 rounded-2xl">
      Upload Resume
    </Link>
  </nav>
  );
};

export default Navbar;