import React from 'react'
import Container from './Layouts/Container';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { Image } from 'antd';



const Dashboard = () => {
    const [data, setData] = useState([]);
    const [viewContactDetail, setViewContactDetail] = useState({});
    const [id, setId] = useState();
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [perPageLimit, setPerPageLimit] = useState(5);
    const [totalPage, setTotalPage] = useState(1);

    const [nameIcon, setNameIcon] = useState(true);
    const [contactIcon, setContactIcon] = useState(true);
    const [addressIcon, setAddressIcon] = useState(true);

    const [addContactModal, setAddContactModal] = useState(false);

    const [orderBy, setOrderBy] = useState('ASC');
    const [sortBy, setSortBy] = useState('id');


    const authToken = localStorage.getItem('token');
    const userMainID = localStorage.getItem('id');
    // console.log(userMainID);

    const apiHeader = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }


    const fetchContact = (search) => {
        axios.get(`http://localhost:4000/contact/fetch?search=${search}&limit=${perPageLimit}&pageNo=${currentPage}&sortBy=${sortBy}&orderBy=${orderBy}`, apiHeader).then((response) => {
            // console.log(response);
            setData(response.data.contacts);
            setTotalPage(response.data.totalPages);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        fetchContact(search);
    }, [search, perPageLimit, currentPage, sortBy, orderBy]);


    const deleteContact = (id) => {
        Swal.fire({
            title: "Are you sure?",
            // text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            // console.log(id, "=================");
            if (result.isConfirmed) {
                axios.delete(`http://localhost:4000/contact/delete/${id}`, apiHeader).then((res) => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your contact has been deleted.",
                        icon: "success"
                    });
                    fetchContact(search);
                }).catch((error) => {
                    console.log(error);
                    Swal.fire({
                        title: "Try Again!",
                        text: "Your contact has not been deleted.",
                        icon: "danger"
                    });
                });
            }
        });
    }

    const saveContact = useFormik({
        initialValues: {
            name: '',
            address: '',
            profile_image: '',
            contact_no: '',

        },

        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            contact_no: Yup.string().min(10, 'Contact No must be at least 10 characters').required('Contact no is required'),
            address: Yup.string().required('Address is required'),
        }),

        onSubmit: values => {
            const formData = new FormData()
            formData.append('name', values.name);
            formData.append('contact_no', values.contact_no);
            formData.append('address', values.address);
            formData.append('profile_image', values.profile_image);

            Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save Contact",
                denyButtonText: `Don't save Contact`
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:4000/contact/save", formData, apiHeader).then((response) => {
                        console.log(response);
                        fetchContact(search);
                        Swal.fire("Saved!", "", "success");
                        setAddContactModal(false);
                    }).catch((error) => {
                        console.log(error);
                        Swal.fire("Changes are not saved", "", "info");
                    })
                }
            });
        }
    });

    const editContact = useFormik({
        initialValues: {
            name: '',
            address: '',
            profile_image: '',
            contact_no: '',
        },

        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            contact_no: Yup.string().min(10, 'Contact no must be at least 10 characters').required('Contact no is required'),
            address: Yup.string().required('Address is required'),
        }),

        onSubmit: values => {
            const formData = new FormData()
            formData.append('name', values.name);
            formData.append('address', values.address);
            formData.append('contact_no', values.contact_no);
            formData.append('profile_image', values.profile_image);


            axios.patch(`http://localhost:4000/contact/update/${id}`, formData, apiHeader)
                .then((response) => {
                    fetchContact(search);
                    // Swal.fire("Updated!", "", "success");
                }).catch((error) => {
                    console.log(error);
                    // Swal.fire("Changes are not updated", "", "info");
                })


        }
    });

    const excelToDatabase = useFormik({
        initialValues: {
            file: '',
        },

        // validationSchema:Yup.object({
        // })

        onSubmit: values => {
            const formData = new FormData()
            formData.append('excelFile', values.file);

            axios.post("http://localhost:4000/contact/import-from-csv", formData, apiHeader).then((response) => {
                console.log(response);
                fetchContact(search);
            }).catch((error) => {
                console.log(error);
            });
        }
    });

    return (
        <>
            <Container>

                <div className='nk-content'>
                    <h4 className='text-center'>All Contacts</h4>
                    <div className="nk-block nk-block-lg">
                        <div className="nk-block-head d-flex justify-content-between">
                            <div className="nk-block-head-content">

                                <div className="nk-header-search ms-3 ms-xl-0">
                                    <em className="icon ni ni-search" />
                                    <input type="text"
                                        className="form-control-sm border-transparent form-focus-none"
                                        placeholder="Search Contact"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className="nk-block-head-content">
                                <button class="btn btn-sm-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#ImportCSVModalDefault"
                                >
                                    <a href="#" class="btn btn-primary ">Import CSV</a>
                                </button>

                                <button class="btn btn-warning me-3"

                                >
                                    <a href={"http://localhost:4000/contact/export/" + userMainID} download>Export CSV</a>
                                </button>

                                <button className='btn btn-primary'
                                    data-bs-target="#AddNewContactFormModal"
                                    onClick={() => {
                                        setAddContactModal(true);
                                    }}
                                >Add Contact</button>
                                {/* <li><a href="#">Add Contact</a></li> */}
                            </div>

                        </div>
                        <div className="card card-preview">
                            <table className="table table-orders">
                                <thead className="tb-odr-head">
                                    <tr className="tb-odr-item">

                                        <th className="tb-odr-action">Profile_Image</th>

                                        <th className="tb-odr-action">Name
                                            {
                                                nameIcon ? <i class="fa-solid fa-up-long"
                                                    onClick={() => {
                                                        setNameIcon(false);
                                                        setSortBy("name");
                                                        setOrderBy("DESC");
                                                    }
                                                    } ></i>
                                                    : <i class="fa-solid fa-down-long"
                                                        onClick={() => {
                                                            setNameIcon(true);
                                                            setSortBy("name");
                                                            setOrderBy("ASC");
                                                        }
                                                        }></i>

                                            }
                                        </th>

                                        <th className="tb-odr-action">Contact
                                            {
                                                contactIcon ? <i class="fa-solid fa-up-long"
                                                    onClick={() => {
                                                        setContactIcon(false)
                                                        setSortBy("contact_no");
                                                        setOrderBy("DESC");
                                                    }
                                                    }
                                                ></i>
                                                    : <i class="fa-solid fa-down-long"
                                                        onClick={() => {
                                                            setContactIcon(true)
                                                            setSortBy("contact_no");
                                                            setOrderBy("ASC");
                                                        }
                                                        }
                                                    ></i>
                                            }

                                        </th>

                                        <th className="tb-odr-action">Address
                                            {
                                                addressIcon ? <i class="fa-solid fa-up-long"
                                                    onClick={() => {
                                                        setAddressIcon(false)
                                                        setSortBy("address");
                                                        setOrderBy("DESC");
                                                    }
                                                    }></i>
                                                    : <i class="fa-solid fa-down-long"
                                                        onClick={() => {
                                                            setAddressIcon(true)
                                                            setSortBy("address");
                                                            setOrderBy("ASC");
                                                        }
                                                        }
                                                    ></i>
                                            }
                                        </th>
                                        <th className="tb-odr-action d-flex">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="tb-odr-body">
                                    {data.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.profile_image
                                                ? <Image src={item.profile_image} style={{ width: "30px" }} alt="" />
                                                : <Image src="images/download.jpg" style={{ width: "20px" }} alt="" />
                                            }
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.contact_no}</td>
                                            <td>{item.address}</td>
                                            <td className="tb-ord-action">

                                                <div className="tb-odr-btns d-none d-md-inline">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#viewContactModal"
                                                        onClick={() => {
                                                            setViewContactDetail(item);
                                                            // console.log(item, "===============");
                                                        }}
                                                    ><i class="fa-solid fa-phone ms-1"></i></button>
                                                </div>
                                                <div className="tb-odr-btns d-none d-md-inline">
                                                    <button className="btn btn-sm btn-secondary ms-1"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#EditFormModal"
                                                        onClick={() => {
                                                            editContact.setFieldValue('name', item.name);
                                                            editContact.setFieldValue('address', item.address);
                                                            editContact.setFieldValue('contact_no', item.contact_no);
                                                            setId(item.id);
                                                        }}
                                                    ><i class="fa-sharp fa-solid fa-pen ms-1"></i></button>
                                                </div>
                                                <div className="tb-odr-btns d-none d-md-inline">
                                                    <button className="btn btn-sm btn-danger ms-1"
                                                        onClick={() => {
                                                            deleteContact(item.id);
                                                        }}
                                                    ><i class="fa-solid fa-trash ms-1"></i></button>
                                                </div>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                            </div>
                        </div>{/* .card */}
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
                    </div>{/* nk-block */}
                </div >

                {/* Modal Default */}
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
                                                <h6>Mobile No </h6>
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
                                                <h6> <span> {viewContactDetail.address}</span></h6>
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

                {/* Update Modal Form */}
                <div className="modal fade" id="EditFormModal">
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

                                                {...editContact.getFieldProps("name")}

                                            />
                                        </div>

                                        {editContact.touched.name && editContact.errors.name
                                            ? <div className="invalid-feedback" style={{ display: "block" }}>{editContact.errors.name}</div>
                                            : ''
                                        }

                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email-address"> Address</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="address" name='address'                                              {...editContact.getFieldProps("address")}
                                            />
                                        </div>
                                        {editContact.touched.address && editContact.errors.address
                                            ? <div className="invalid-feedback" style={{ display: "block" }}>{editContact.errors.address}</div>
                                            : ''
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="phone-no">Contact No</label>
                                        <div className="form-control-wrap">
                                            <input type="text" className="form-control" id="contact_no" name='contact_no'
                                                {...editContact.getFieldProps("contact_no")}
                                            />
                                        </div>
                                        {editContact.touched.contact_no && editContact.errors.contact_no
                                            ? <div className="invalid-feedback" style={{ display: "block" }}>{editContact.errors.contact_no}</div>
                                            : ''
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="file"> Profile</label>
                                        <div className="form-control-wrap">
                                            <input type="file" className="form-control" id="profile" name='profile_image'
                                                // {...editContact.getFieldProps("profile_image")}
                                                onChange={(e) => {
                                                    editContact.setFieldValue('profile_image', e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-lg btn-primary" data-bs-dismiss="modal" >Edit Contact</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>


                {/* Add new Contact Modal Form */}
                {addContactModal &&
                    <>
                        <div className="modal fade show" style={{ display: "block" }} id="AddNewContactFormModal">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Contact </h5>
                                        <a href="#" className="close" aria-label="Close"
                                            onClick={() => {
                                                setAddContactModal(false)
                                            }}
                                        >
                                            <em className="icon ni ni-cross" />
                                        </a>
                                    </div>
                                    <div className="modal-body">
                                        <form className="form-validate is-alter" onSubmit={saveContact.handleSubmit}>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="full-name">Name</label>
                                                <div className="form-control-wrap">
                                                    <input type="text" className="form-control" id="name"
                                                        name='name'
                                                        {...saveContact.getFieldProps('name')}
                                                    />
                                                </div>
                                                {saveContact.touched.name && saveContact.errors.name
                                                    ? <div className="invalid-feedback" style={{ display: "block" }}>{saveContact.errors.name}</div>
                                                    : ''
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="email-address">Address</label>
                                                <div className="form-control-wrap">
                                                    <input type="text" className="form-control" id="address"
                                                        name="address"
                                                        {...saveContact.getFieldProps('address')}
                                                    />
                                                </div>
                                                {saveContact.touched.address && saveContact.errors.address
                                                    ? <div className="invalid-feedback" style={{ display: "block" }}>{saveContact.errors.address}</div>
                                                    : ''
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="phone-no">Phone No</label>
                                                <div className="form-control-wrap">
                                                    <input type="text" className="form-control" id="contact_no"
                                                        name='contact_no'
                                                        {...saveContact.getFieldProps('contact_no')}
                                                    />
                                                </div>
                                                {saveContact.touched.contact_no && saveContact.errors.contact_no
                                                    ? <div className="invalid-feedback" style={{ display: "block" }}>{saveContact.errors.contact_no}</div>
                                                    : ''
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="file">Profile</label>
                                                <div className="form-control-wrap">
                                                    <input type="file" className="form-control" id="profile_image"
                                                        name='profile_image'
                                                        onChange={(e) => {
                                                            saveContact.setFieldValue('profile_image', e.target.files[0]);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <button type="submit"
                                                    className="btn btn-lg btn-primary"
                                                >Save Contact</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-backdrop show'></div>
                    </>
                }

                {/* Import CSV Modal Default */}
                <div className="modal fade" tabIndex={-1} id="ImportCSVModalDefault">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Choose Your File</h5>
                                <a href="#" className="close" data-bs-dismiss="modal" aria-label="Close">
                                    <em className="icon ni ni-cross" />
                                </a>
                            </div>
                            <div className="modal-body">
                                <form className="form-validate is-alter" onSubmit={excelToDatabase.handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="file">Choose File</label>
                                        <div className="form-control-wrap">
                                            <input type="file" className="form-control" id="file"
                                                name='file'
                                                onChange={(e) => {
                                                    excelToDatabase.setFieldValue('file', e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn  btn-primary" data-bs-dismiss="modal">Import CSV File</button>
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

export default Dashboard;