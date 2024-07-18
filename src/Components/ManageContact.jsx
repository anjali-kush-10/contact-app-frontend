import React, { useEffect, useState, useCallback } from 'react';
import Container from './Layouts/Container';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import { Image } from 'antd';


const ManageContact = () => {

    const [data, setData] = useState([]);
    const [myPermission, setMyPermission] = useState([]);
    const [search, setSearch] = useState("");

    const role = JSON.parse(localStorage.getItem('role'));

    const [id, setID] = useState();

    const [viewContactDetail, setViewContactDetail] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [perPageLimit, setPerPageLimit] = useState(5);
    const [totalPage, setTotalPage] = useState(1);

    const authToken = localStorage.getItem('token');

    useEffect(() => {
        if (role?.my_permission) {
            setMyPermission(role?.my_permission?.permission)
        }
    }, [role])


    const apiHeader = {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    }

    const fetchContact = (search) => {
        axios.get(`http://localhost:4000/contact/managecontact?search=${search}&limit=${perPageLimit}&pageNo=${currentPage}`, apiHeader)
            .then((response) => {
                // console.log(response);
                setData(response.data.rows);
                setTotalPage(response.data.totalPages);
            }).catch((error) => {
                console.log(error.message);
            })

    }

    useEffect(() => {
        fetchContact(search);
    }, [search, perPageLimit, currentPage]);


    const editContact = useFormik({
        initialValues: {
            name: '',
            contact_no: '',
            address: '',
            profile_image: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            contact_no: Yup.string().min(10, 'Contact no must be take atleast 10 characters').required('Contact No is required'),
            address: Yup.string().required('Address is required'),
        }),
        onSubmit: values => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('contact_no', values.contact_no);
            formData.append('address', values.address);
            formData.append('profile_image', values.profile_image);

            axios.patch(`http://localhost:4000/admin/editcontact/${id}`, formData, apiHeader)
                .then((response) => {
                    console.log(response);
                    // toast.success(response.data.message);
                    fetchContact(search);
                }).catch((error) => {
                    console.log(error.message);
                    // toast.error(error.message);
                });
        }
    });

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        editContact.setFieldValue('profile_image', file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const dropzoneStyles = {
        border: "2px dashed black",
        padding: '50px',
        cursor: "pointer",
        textAlign: "center"
    }


    const deleteContact = (id) => {
        Swal.fire({
            title: "Are you sure?",
            // text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:4000/admin/deletecontact/${id}`, apiHeader)
                    .then((response) => {
                        // console.log(response);
                        fetchContact(search);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your contact has been deleted.",
                            icon: "success"
                        });
                    }).catch((error) => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your contact has not been deleted.",
                            icon: "danger"
                        });

                    })

            }
        });
    }


    return (
        <>
            <ToastContainer />
            <Container>
                <div className='nk-content'>
                    <h4 className='text-center'>Manage Contacts<i class="fa-solid fa-phone ms-1"></i></h4>
                    <div class="nk-block nk-block-lg">
                        <div class="nk-block-head">
                            <div class="nk-block-head-content">
                                <div className="nk-header-search ms-3 ms-xl-0">
                                    <em className="icon ni ni-search" />
                                    <input type="text"
                                        className="form-control-sm border-transparent form-focus-none"
                                        placeholder="Search Contact"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <br />
                                <div>
                                    <div className="card card-bordered card-preview">
                                        <div className="card-inner">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Profile Image</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Contacts</th>
                                                        <th scope="col">Address</th>
                                                        <th scope='col'>Owner</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.map(item => (
                                                            <tr key={item}>
                                                                <td>{item.profile_image
                                                                    ? <Image src={item.profile_image} style={{ width: "30px" }} alt="" />
                                                                    : <Image src="images/download.jpg" style={{ width: "20px" }} alt="" />
                                                                }</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.contact_no}</td>
                                                                <td>{item.address}</td>
                                                                <td>{item.user_data.name} </td>
                                                                <td className="tb-ord-action">

                                                                    <div className="tb-odr-btns d-none d-md-inline">
                                                                        <button className="btn btn-sm btn-warning"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#viewContactModal"
                                                                            onClick={() => {
                                                                                setViewContactDetail(item);
                                                                                // console.log(item, "===============");
                                                                            }}
                                                                        > <i class="fa-solid fa-phone ms-1"></i></button>
                                                                    </div>
                                                                    {myPermission.some((key) => key === 3) &&
                                                                        <div className="tb-odr-btns d-none d-md-inline">
                                                                            <button className="btn btn-sm btn-secondary ms-1"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#editContactFormModal"
                                                                                onClick={() => {
                                                                                    editContact.setFieldValue('name', item.name);
                                                                                    editContact.setFieldValue('contact_no', item.contact_no);
                                                                                    editContact.setFieldValue('address', item.address);
                                                                                    editContact.setFieldValue('profile_image', item.profile_image);
                                                                                    setID(item.id);
                                                                                }}

                                                                            ><i class="fa-sharp fa-solid fa-pen ms-1"></i></button>
                                                                        </div>
                                                                    }
                                                                    {myPermission.some((key) => key === 4) &&
                                                                        <div className="tb-odr-btns d-none d-md-inline">
                                                                            <button className="btn btn-sm btn ms-1"
                                                                                style={{ backgroundColor: "red", color: "white" }}
                                                                                onClick={() => deleteContact(item.id)}
                                                                            ><i class="fa-solid fa-trash ms-1"></i></button>
                                                                        </div>
                                                                    }

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

                {/* View Contact Modal Default */}
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
                                        {viewContactDetail?.profile_image
                                            ? <Image src={viewContactDetail.profile_image} style={{ width: "200px" }} alt="" />
                                            : <Image src="images/download.jpg" style={{ width: "200px" }} alt="" />
                                        }
                                    </div>
                                    <div className="card-inner" style={{ backgroundColor: "#f5f6fa", borderRadius: "20px", margin: "15px" }}>
                                        <div className='d-flex justify-content-around'>
                                            <div>
                                                <h6>Name</h6>
                                                <h6>Contact</h6>
                                                <h6>Address</h6>
                                            </div>
                                            <div>
                                                <h6>:</h6>
                                                <h6>:</h6>
                                                <h6>:</h6>
                                            </div>
                                            <div>
                                                <h6> <span> {viewContactDetail.name}</span></h6>
                                                <h6><span> {viewContactDetail.contact_no}</span></h6>
                                                <h6><span> {viewContactDetail.address}</span></h6>
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


                {/* Edit Contact Modal Form */}
                <div className="modal fade" id="editContactFormModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Details</h5>
                                <a href="#" className="close" data-bs-dismiss="modal" aria-label="Close">
                                    <em className="icon ni ni-cross" />
                                </a>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={editContact.handleSubmit} className="form-validate is-alter">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="full-name">Name</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="name"
                                                name='name'
                                                {...editContact.getFieldProps('name')}
                                            />
                                        </div>
                                        {
                                            editContact.touched.name && editContact.errors.name
                                                ? <div className='invalid-feedback' style={{ display: "block" }}>{editContact.errors.name}</div>
                                                : ''
                                        }


                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email-address">Contact</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="contact_no" name='contact_no'
                                                {...editContact.getFieldProps('contact_no')}
                                            />
                                        </div>
                                        {
                                            editContact.touched.contact_no && editContact.errors.contact_no
                                                ? <div className='invalid-feedback' style={{ display: "block" }}>{editContact.errors.contact_no}</div>
                                                : ''
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email-address">Address</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="address" name='address'
                                                {...editContact.getFieldProps('address')}
                                            />
                                        </div>
                                        {
                                            editContact.touched.address && editContact.errors.address
                                                ? <div className='invalid-feedback' style={{ display: "block" }}>{editContact.errors.address}</div>
                                                : ''
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email-address">Profile Image</label>
                                        {
                                            editContact.values.profile_image
                                            &&
                                            <a className="close" aria-label="Close">
                                                <em className="icon ni ni-cross"
                                                    onClick={() => {
                                                        editContact.setFieldValue('profile_image', '');
                                                    }}
                                                />
                                            </a>
                                        }

                                        {
                                            editContact.values.profile_image
                                                ? typeof editContact.values.profile_image == "object"
                                                    ?
                                                    <div>
                                                        <Image src={URL.createObjectURL(editContact.values.profile_image)} alt="Preview" />
                                                    </div>
                                                    :
                                                    <div>
                                                        <Image src={editContact.values.profile_image} alt="Preview" />
                                                    </div>
                                                :
                                                <div {...getRootProps()} style={dropzoneStyles}>
                                                    <input {...getInputProps()}
                                                        onChange={(e) => {
                                                            editContact.setFieldValue('profile_image', e.target.files[0]);
                                                        }}
                                                    />
                                                    {
                                                        isDragActive
                                                            ? <p>Drop the Profile Image here...</p>
                                                            : <p>Drag 'n' Drop the Profile Image here , or click to select a profile Image!!! </p>
                                                    }

                                                </div>
                                        }
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-lg btn-primary" data-bs-dismiss="modal" >Edit Contact</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>



            </Container >
        </>
    )
}

export default ManageContact;