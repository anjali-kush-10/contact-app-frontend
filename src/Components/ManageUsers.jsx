import React, { useEffect, useState, useCallback } from 'react';
import Container from './Layouts/Container';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { useSelector } from 'react-redux';



const ManageUsers = () => {

    const userData = useSelector((state) => state.authReducer.userData);
    const authToken = useSelector((data) => data.authReducer.userToken);

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const [changePassModal, setChangePassModal] = useState(false);

    const [viewContactDetail, setViewContactDetail] = useState({});
    const [id, setID] = useState();

    const [perPageLimit, setPerPageLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [myPermission, setMyPermission] = useState([]);



    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('role'));
        if (role?.my_permission) {
            setMyPermission(role?.my_permission?.permission)
        }
    }, []);

    // const authToken = localStorage.getItem('token');

    const apiHeader = {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    }

    const fetchUsers = (search) => {
        axios.get(`http://localhost:4000/user/getuser?search=${search}&limit=${perPageLimit}&pageNo=${currentPage}`, apiHeader)
            .then((response) => {
                // console.log(response);
                setData(response.data.rows);
                setTotalPage(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUsers(search);
    }, [search, perPageLimit, currentPage]);

    const changePassword = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },


        validationSchema: Yup.object({
            newPassword: Yup.string().min(8, "password length must be take 8 characters").required('New Password is required'),
            confirmPassword: Yup.string().min(8, "password length must be take 8 characters").required('Confirm Password is required')
                .oneOf([Yup.ref('newPassword')], 'Confirm password must be same as new password')
        }),

        onSubmit: values => {
            const obj = { "newPassword": values.newPassword, "confirmPassword": values.confirmPassword };

            console.log(id);
            axios.patch(`http://localhost:4000/admin/changepassword/${id}`, obj, apiHeader)
                .then((response) => {
                    // console.log(response);
                    toast.success(response.data.message);
                    changePassword.values.newPassword = "";
                    changePassword.values.confirmPassword = "";
                    setChangePassModal(false);
                }).catch((error) => {
                    console.log(error);
                    toast.error("doesn't change password");
                    changePassword.values.newPassword = "";
                    changePassword.values.confirmPassword = "";
                });
        }
    });

    const editProfile = useFormik({
        initialValues: {
            name: '',
            email: '',
            image: '',
        },

        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().required("Email is required"),
        }),

        onSubmit: values => {
            const formData = new FormData()
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('image', values.image);

            axios.patch(`http://localhost:4000/admin/editprofile/${id}`, formData, apiHeader)
                .then((response) => {
                    console.log(response);
                    fetchUsers(search);
                }).catch((error) => {
                    console.log(error.message);
                })

        }
    });

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        editProfile.setFieldValue('image', file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const dropzoneStyles = {
        border: '2px dashed black',
        borderRadius: '4px',
        padding: '60px',
        textAlign: 'center',
        margin: '20px auto',
        width: '100%',
        cursor: 'pointer',
    };


    const addUserModal = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().required('Email is required'),
            password: Yup.string().min(6, 'Password should be at least 6 characters long').required('Password is required')
        }),
        onSubmit: values => {
            console.log(values);
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            console.log(formData);

            axios.post("http://localhost:4000/admin/post-users", formData, apiHeader)
                .then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error);
                })
        }

    });

    console.log('userData==========>', userData, authToken);

    return (
        <>
            <ToastContainer />
            <Container>
                <div className='nk-content'>
                    <h4 className='text-center'
                    >Manage Users<i className="fa-solid fa-circle-user ms-2"></i></h4>
                    <div className="nk-block nk-block-lg">
                        <div className="nk-block-head">
                            <div className="nk-block-head-content">
                                <div className="nk-header-search ms-3 ms-xl-0">
                                    <em className="icon ni ni-search" />
                                    <input type="text"
                                        className="form-control-sm border-transparent form-focus-none"
                                        placeholder="Search Contact"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    // style={{ backgroundColor: "grey", color: "white" }}
                                    />
                                    {
                                        myPermission.some((key) => (key === 2)) &&
                                        <button className='btn btn-primary'
                                            style={{ marginLeft: "700px" }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#addUserModalForm"
                                        >Add User</button>
                                    }
                                </div>
                                <br />
                                <div>
                                    <div className="card card-bordered card-preview">
                                        <div className="card-inner">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Profile</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Action</th>
                                                        <th scope='col'>View Contacts</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.map(item => (
                                                            <tr key={item}>
                                                                <td>{item.image
                                                                    ? <Image src={item.image} style={{ width: "30px" }} alt="" />
                                                                    : <Image src="images/download.jpg" style={{ width: "20px" }} alt="" />

                                                                }</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.email}</td>
                                                                <td className="tb-ord-action">

                                                                    <div className="tb-odr-btns d-none d-md-inline">
                                                                        <button className="btn btn-sm btn-primary"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#viewContactModal"

                                                                            onClick={() => {
                                                                                setViewContactDetail(item);
                                                                                // console.log(item, "===============");
                                                                            }}
                                                                        ><i class="fa-solid fa-circle-user ms-1"></i></button>
                                                                    </div>
                                                                    {myPermission.some((key) => (key === 3)) &&

                                                                        <div className="tb-odr-btns d-none d-md-inline ms-1">
                                                                            <button className="btn btn-sm btn-secondary"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#EditProfileFormModal"
                                                                                onClick={() => {
                                                                                    editProfile.setFieldValue('name', item.name);
                                                                                    editProfile.setFieldValue('email', item.email);
                                                                                    editProfile.setFieldValue('image', item.image);
                                                                                    setID(item.id);
                                                                                    // console.log(item);
                                                                                }}
                                                                            ><i class="fa-solid fa-user-pen ms-1"></i></button>
                                                                        </div>

                                                                    }
                                                                    {
                                                                        myPermission.some((key) => (key === 3)) &&
                                                                        <div className="tb-odr-btns d-none d-md-inline">
                                                                            <button className="btn btn-sm btn-info ms-1"
                                                                                data-bs-target="#changePasswordModal"
                                                                                onClick={() => {
                                                                                    changePassword.setFieldValue('newpassword', item.newPassword);
                                                                                    changePassword.setFieldValue('confirmpassword', item.confirmPassword);
                                                                                    setID(item.id);
                                                                                    setChangePassModal(true)
                                                                                }}
                                                                            ><i class="fa-solid fa-key ms-1"></i></button>
                                                                        </div>
                                                                    }

                                                                </td>
                                                                <td>
                                                                    <div className="tb-odr-btns d-none d-md-inline">
                                                                        <Link to={`/viewcontact/${item.id}`}> <button className="btn btn-sm btn-primary"
                                                                        >
                                                                            View Contacts
                                                                        </button></Link>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <ReactPaginate
                                            previousLabel={"Previous"}
                                            nextLabel={'Next'}
                                            breakLabel={"..."}
                                            pageCount={totalPage}
                                            pageRangeDisplayed={2}
                                            onPageChange={(e) => setCurrentPage(e.selected + 1)}
                                            containerClassName={'pagination justify-content-center'}
                                            pageClassName={'page-item'}
                                            pageLinkClassName={'page-link'}
                                            previousClassName={'page-item'}
                                            previousLinkClassName={'page-link'}
                                            nextClassName={'page-item'}
                                            nextLinkClassName={'page-link'}
                                            breakClassName={"page-item"}
                                            breakLinkClassName={'page-link'}
                                            activeClassName={'active'}
                                        />
                                        <div className='me-5'>
                                            <b className='me-2'>Limit:</b>
                                            <select
                                                onChange={(e) => setPerPageLimit(e.target.value)}>
                                                {/* <option value={2}>2</option> */}
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* view Profile Modal Default */}
                <div div className="modal fade" tabIndex={- 1
                } id="viewContactModal" >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Detail</h5>
                                <a href="#" className="close" data-bs-dismiss="modal" aria-label="Close">
                                    <em className="icon ni ni-cross" />
                                </a>
                            </div>
                            <div className="modal-body">
                                <div className="card">
                                    <div className="d-flex justify-content-center">
                                        {viewContactDetail?.image
                                            ? <Image src={viewContactDetail.image} style={{ width: "200px" }} alt="" />
                                            : <Image src="images/download.jpg" style={{ width: "200px" }} alt="" />
                                        }
                                    </div>
                                    <div className="card-inner" style={{ backgroundColor: "#f5f6fa", borderRadius: "20px", margin: "15px" }}>
                                        <div className='d-flex justify-content-around'>
                                            <div>
                                                <h6>Name</h6>
                                                <h6>Email ID</h6>
                                            </div>
                                            <div>
                                                <h6>:</h6>
                                                <h6>:</h6>
                                            </div>
                                            <div>
                                                <h6> <span> {viewContactDetail.name}</span></h6>
                                                <h6><span> {viewContactDetail.email}</span></h6>
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>


                {/* change password Modal Form */}
                {changePassModal &&
                    <>
                        <div className="modal fade show" style={{ display: 'block' }} id="changePasswordModal">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Change Password</h5>
                                        <a href="#" className="close" aria-label="Close"
                                            onClick={() => {
                                                setChangePassModal(false)
                                            }}
                                        >
                                            <em className="icon ni ni-cross" />
                                        </a>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={changePassword.handleSubmit} className="form-validate is-alter">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="newPassword">New Password</label>
                                                <div className="form-control-wrap">
                                                    <input type="password" className="form-control" id="newPassword"
                                                        name='newPassword'
                                                        {...changePassword.getFieldProps("newPassword")}
                                                    />
                                                </div>
                                                {changePassword.touched.newPassword && changePassword.errors.newPassword
                                                    ? <div className="invalid-feedback" style={{ display: "block" }}>{changePassword.errors.newPassword}</div>
                                                    : ''
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                                <div className="form-control-wrap">
                                                    <input type="password" className="form-control" id="confirmPassword"
                                                        name='confirmPassword'
                                                        {...changePassword.getFieldProps("confirmPassword")}

                                                    />
                                                </div>
                                                {changePassword.touched.confirmPassword && changePassword.errors.confirmPassword
                                                    ? <div className="invalid-feedback" style={{ display: "block" }}>{changePassword.errors.confirmPassword}</div>
                                                    : ''
                                                }
                                            </div>
                                            <div className="form-group">
                                                <button type="submit"
                                                    className="btn btn-lg btn-primary"
                                                >Save Password
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-backdrop show'></div>
                    </>
                }


                {/* Edit Profile Modal Form */}
                <div className="modal fade" id="EditProfileFormModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Details</h5>
                                <a href="#" className="close" data-bs-dismiss="modal" aria-label="Close">
                                    <em className="icon ni ni-cross" />
                                </a>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={editProfile.handleSubmit} className="form-validate is-alter">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="full-name">Name</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="name"
                                                name='name'

                                                {...editProfile.getFieldProps("name")}

                                            />
                                        </div>

                                        {editProfile.touched.name && editProfile.errors.name
                                            ? <div className="invalid-feedback" style={{ display: "block" }}>{editProfile.errors.name}</div>
                                            : ''
                                        }

                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email-address"> Email</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="email" name='email'
                                                {...editProfile.getFieldProps("email")}

                                            />
                                        </div>
                                        {editProfile.touched.email && editProfile.errors.email
                                            ? <div className="invalid-feedback" style={{ display: "block" }}>{editProfile.errors.email}</div>
                                            : ''
                                        }
                                    </div>


                                    <div className='form-group'>
                                        <label className="form-label" htmlFor="file"> Profile Image</label>
                                        {
                                            editProfile.values.image
                                            &&
                                            <a className="close" aria-label="Close">
                                                <em className="icon ni ni-cross"
                                                    onClick={() => {
                                                        editProfile.setFieldValue('image', '');
                                                    }}
                                                />
                                            </a>
                                        }

                                        {
                                            editProfile.values.image
                                                ?
                                                typeof editProfile.values.image == "object"
                                                    ?
                                                    <div>
                                                        <Image src={URL.createObjectURL(editProfile.values.image)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                                    </div>
                                                    :
                                                    <div>

                                                        <Image src={editProfile.values.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                                    </div>
                                                : <div {...getRootProps()} style={dropzoneStyles}>
                                                    <input {...getInputProps()}
                                                        onChange={(e) => {
                                                            editProfile.setFieldValue('image', e.target.files[0]);
                                                        }}
                                                    />
                                                    {
                                                        isDragActive
                                                            ?
                                                            <p>Drop the Profile Image here ...</p>
                                                            :
                                                            <p>Drag 'n' drop a Profile Image here, or click to select a Profile</p>
                                                    }
                                                </div>
                                        }
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-lg btn-primary" data-bs-dismiss="modal" >Edit Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Add User Modal Form */}
                <div className="modal fade" id="addUserModalForm">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Information</h5>
                                <a href="#" className="close" data-bs-dismiss="modal" aria-label="Close">
                                    <em className="icon ni ni-cross" />
                                </a>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={addUserModal.handleSubmit} className="form-validate is-alter">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="name">Name</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="full-name" name='name'
                                                {...addUserModal.getFieldProps('name')}
                                            />
                                        </div>
                                        {
                                            addUserModal.touched.name && addUserModal.errors.name
                                                ? <div className='invalid-feedback' style={{ display: "block" }}>{addUserModal.errors.name}</div>
                                                : ""
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email-address">Email</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="email-address" name='email'
                                                {...addUserModal.getFieldProps('email')}
                                            />
                                        </div>
                                        {
                                            addUserModal.touched.email && addUserModal.errors.email
                                                ? <div className='invalid-feedback' style={{ display: "block" }}>{addUserModal.errors.email}</div>
                                                : ""
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <div className="form-control-wrap">
                                            <input type="password" className="form-control" id="password" name='password'
                                                {...addUserModal.getFieldProps('password')}
                                            />
                                        </div>
                                        {
                                            addUserModal.touched.password && addUserModal.errors.password
                                                ? <div className='invalid-feedback' style={{ display: "block" }}>{addUserModal.errors.password}</div>
                                                : ""
                                        }

                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-lg btn-primary"
                                            data-bs-dismiss="modal"
                                        >Save Informations</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


            </Container >
        </>

    );
}

export default ManageUsers;