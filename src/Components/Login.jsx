import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../Action/actionCreator';


const Login = () => {

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.authReducer.userData);
  const authToken = useSelector((data) => data.authReducer.userToken);


  const navigate = useNavigate();

  const loginInitialValues = {
    email: '',
    password: ''
  };

  const loginValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  })

  const loginOnSubmit = (values) => {
    // const result = await dispatch(loginUser(values))
    // if (result.status === true) {
    //   navigate('/')
    //   toast.success("Logged in Successfully")
    // }
    // else {
    //   toast.error(result.error.message);
    // }

    axios.post("http://localhost:4000/user/login", values).then((response) => {
      // console.log(response, "---------->response");

      localStorage.setItem('name', response.data.data.name);
      localStorage.setItem('image', response.data.data.image);
      localStorage.setItem('role', JSON.stringify(response.data.data.role_data));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id', response.data.data.id);

      dispatch({ type: "UPDATE_USER", data: response.data })


      navigate('/');
    }).catch((error) => {
      toast.error(error.message);
    })
  }

  // useEffect=()=>{
  //   var authToken=localStorage.getItem('token');
  //   if(authToken)
  //     {
  //       navigate('/');
  //     }
  // }

  console.log("authReducer:--------", userData, authToken);



  return (
    <>
      <ToastContainer />
      <div className="nk-content ">
        <div className="nk-block nk-block-middle nk-auth-body  wide-xs">
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
                  <h4 className="nk-block-title">Login</h4>
                  <div className="nk-block-des">
                    <p>Access the Dashlite panel using your email and passcode.</p>
                  </div>
                </div>
              </div>
              <Formik
                initialValues={loginInitialValues}
                validationSchema={loginValidationSchema}
                onSubmit={loginOnSubmit}
              >
                <Form>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="default-01">Email</label>
                    </div>
                    <div className="form-control-wrap">
                      <Field type="text" className="form-control form-control-lg" id="default-01" placeholder="Enter your email address or username" name="email" />
                      <ErrorMessage name="email">{errorMsg => <div className='text-danger'>{errorMsg}</div>}</ErrorMessage>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">Password</label>
                      <a className="link link-primary link-sm" href="html/pages/auths/auth-reset-v2.html">Forgot Code?</a>
                    </div>
                    <div className="form-control-wrap">
                      <a href="#" className="form-icon form-icon-right passcode-switch lg" data-target="password">
                        <em className="passcode-icon icon-show icon ni ni-eye" />
                        <em className="passcode-icon icon-hide icon ni ni-eye-off" />
                      </a>
                      <Field type="password" className="form-control form-control-lg" id="password" placeholder="Enter your passcode" name="password" />
                      <ErrorMessage name="password">{errorMsg => <div className='text-danger'>{errorMsg}</div>}</ErrorMessage>
                    </div>
                  </div>
                  <div className="form-group">
                    <button type='submit' className="btn btn-lg btn-primary btn-block">Sign in</button>
                  </div>
                </Form>
              </Formik>
              <div className="form-note-s2 text-center pt-4"> New on our platform? <a href="html/pages/auths/auth-register-v2.html"><Link to="/register">Create an account</Link></a>
              </div>
              <div className="text-center pt-4 pb-3">
                <h6 className="overline-title overline-title-sap"><span>OR</span></h6>
              </div>
              <ul className="nav justify-center gx-4">
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
                  <p className="text-soft">© 2023 Dashlite. All Rights Reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}
export default Login;