import React from 'react';

import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <>
      <NavBar />
      <section className="resume-section p-3 p-lg-5 d-flex" id="about">
        <div className="w-100">
          <div className="text-success subheading mb-5">Dashboard</div>
          <p className="lead mb-5">Em desenvolvimento</p>
          <div className="social-icons">
            <a href="#ww">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="#ww">
              <i className="fab fa-github" />
            </a>
            <a href="#ww">
              <i className="fab fa-twitter" />
            </a>
            <a href="#ww">
              <i className="fab fa-facebook-f" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
