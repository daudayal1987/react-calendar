import React from 'react';
import ReactDOM from 'react-dom';

import CalendarHeader from './components/CalendarHeader';
import CalendarContent from './components/CalendarContent';

function App() {
  return (
    <div className="container">
      <header>
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">
            <img src="/assets/logo.png" width="150" className="d-inline-block align-top" alt="" />
          </a>
        </nav>
      </header>

      <CalendarHeader />
      <CalendarContent />
      
      <div className="masthead-footer footer text-white">
        <div className="row p-4">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-4">
                <strong className="text-uppercase">Company</strong>
                <ul className="list-unstyled text-small">
                  <li><a href="#" className="text-white">About Us</a></li>
                  <li><a href="#" className="text-white">Contact</a></li>
                  <li><a href="#" className="text-white">Costs and billing</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <strong className="text-uppercase">Help</strong>
                <ul className="list-unstyled text-small">
                  <li><a href="#" className="text-white">How it works</a></li>
                  <li><a href="#" className="text-white">Support</a></li>
                  <li><a href="#" className="text-white">Trust and safety</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <strong className="text-uppercase">Legalities</strong>
                <ul className="list-unstyled text-small">
                  <li><a href="#" className="text-white">Privacy</a></li>
                  <li><a href="#" className="text-white">Terms & conditions</a></li>
                  <li><a href="#" className="text-white">Code of conduct</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4" style={{borderLeft: "1px solid", paddingLeft: "50px"}}>
            <strong className="text-uppercase">Connect with us</strong>
            <div className="socials">
              <a href="#">
                <img src="/assets/social_linkedin.png" width="36" alt=""/>
              </a>
              <a href="#">
                <img src="/assets/social_facebook.png" width="36" alt="" />
              </a>
              <a href="#">
                <img src="/assets/social_twitter.png" width="36" alt=""/>
              </a>
              <a href="#">
                <img src="/assets/social_youtube_default.png" width="36" alt=""/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
