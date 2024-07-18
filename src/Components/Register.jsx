import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';



const Register = () => {
  const navigate = useNavigate();

  const registerInitialValues = {
    name: '',
    email: '',
    password: '',
  };
  const registerValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const registerOnSubmit = (values) => {
    // console.log(values);
    axios.post("http://localhost:4000/user/postuser", values).then((response) => {
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }).catch((error) => {
      toast.error(error.message);
    });
  };


  return (
    <>
      <ToastContainer />
      <div className="nk-content ">
        <div className="nk-block nk-block-middle nk-auth-body wide-xs">
          <div className="brand-logo pb-4 text-center">
            <a href="html/index.html" className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src="./images/logo.png" srcSet="./images/logo2x.png 2x" alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src="./images/logo-dark.png" srcSet="./images/logo-dark2x.png 2x" alt="logo-dark" />
            </a>
          </div>
          <div className="card">
            <div className="card-inner card-inner-lg">
              <div className="nk-block-head">
                <div className="nk-block-head-content">
                  <h4 className="nk-block-title">Register</h4>
                  <div className="nk-block-des">
                    <p>Create New Dashlite Account</p>
                  </div>
                </div>
              </div>
              <Formik
                initialValues={registerInitialValues}
                validationSchema={registerValidationSchema}
                onSubmit={registerOnSubmit}
              >
                <Form>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Name</label>
                    <div className="form-control-wrap">
                      <Field type="text" className="form-control form-control-lg" id="name" placeholder="Enter your name" name="name" />
                      {/* <ErrorMessage name="name" /> */}
                      <ErrorMessage name="name">{errorMsg => <div className='text-danger'>{errorMsg}</div>}</ErrorMessage>

                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <div className="form-control-wrap">
                      <Field type="text" className="form-control form-control-lg" id="email" placeholder="Enter your email address or username" name="email" />
                      {/* <ErrorMessage email="email" /> */}
                      <ErrorMessage name="email">{errorMsg => <div className='text-danger'>{errorMsg}</div>}</ErrorMessage>

                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="form-control-wrap">
                      <a href="#" className="form-icon form-icon-right passcode-switch lg" data-target="password">
                        <em className="passcode-icon icon-show icon ni ni-eye" />
                        <em className="passcode-icon icon-hide icon ni ni-eye-off" />
                      </a>
                      <Field type="password" className="form-control form-control-lg" id="password" placeholder="Enter your passcode" name="password" />
                      {/* <ErrorMessage password="password" /> */}
                      <ErrorMessage name="password">{errorMsg => <div className='text-danger'>{errorMsg}</div>}</ErrorMessage>
                    </div>
                  </div>
                  {/* <div className="form-group">
                  <div className="custom-control custom-control-xs custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="checkbox" />
                    <label className="custom-control-label" htmlFor="checkbox">I agree to Dashlite <a href="#">Privacy Policy</a> &amp; <a href="#"> Terms.</a></label>
                  </div>
                </div> */}
                  <div className="form-group">
                    <button type="submit" className="btn btn-lg btn-primary btn-block">Register</button>
                  </div>
                </Form>
              </Formik>
              <div className="form-note-s2 text-center pt-4"> Already have an account? <Link to="/login">SignIn</Link>
              </div>
              <div className="text-center pt-4 pb-3">
                <h6 className="overline-title overline-title-sap"><span>OR</span></h6>
              </div>
              <ul className="nav justify-center gx-8">
                <li className="nav-item"><a className="nav-link" href="#">Facebook</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Google</a></li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="nk-footer nk-auth-footer-full">
        <div className="container wide-lg">
          <div className="row g-3">
            <div className="col-lg-6 order-lg-last">
              <ul className="nav nav-sm justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <a className="nav-link" href="#">Terms &amp; Condition</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Privacy Policy</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Help</a>
                </li>
                <li className="nav-item dropup">
                  <a className="dropdown-toggle dropdown-indicator has-indicator nav-link" data-bs-toggle="dropdown" data-offset="0,10"><span>English</span></a>
                  <div className="dropdown-menu dropdown-menu-sm dropdown-menu-end">
                    <ul className="language-list">
                      <li>
                        <a href="#" className="language-item">
                          <img src="./images/flags/english.png" alt className="language-flag" />
                          <span className="language-name">English</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="language-item">
                          <img src="./images/flags/spanish.png" alt className="language-flag" />
                          <span className="language-name">Español</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="language-item">
                          <img src="./images/flags/french.png" alt className="language-flag" />
                          <span className="language-name">Français</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="language-item">
                          <img src="./images/flags/turkey.png" alt className="language-flag" />
                          <span className="language-name">Türkçe</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="nk-block-content text-center text-lg-left">
                <p className="text-soft">© 2023 CryptoLite. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  )
}
export default Register;