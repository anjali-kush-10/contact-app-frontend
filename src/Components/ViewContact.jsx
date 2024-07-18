import React, { useEffect, useState } from 'react'
import Container from './Layouts/Container'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Image } from 'antd';
import { useSelector } from 'react-redux';

const ViewContact = () => {
    const userData = useSelector((state) => state.authReducer.userData);
    const authToken = useSelector((data) => data.authReducer.userToken);

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");

    const { id } = useParams();


    // const authToken = localStorage.getItem('token');

    const apiHeader = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    const viewUserContact = (search) => {
        axios.get(`http://localhost:4000/user/view-contacts-by-id/${id}&search=${search}`, apiHeader)
            .then((response) => {
                // console.log(response?.data?.allUsers);
                setData(response.data.allUsers[0].Contacts);
            }).catch((error) => {
                console.log(error.message);
            });
    }

    useEffect(() => {
        viewUserContact(search);
    }, [search]);


    return (
        <>
            <Container>
                <div className='nk-content'>
                    <h4 className='text-center'>All Contacts
                        <i class="fa-solid fa-phone ms-1"></i></h4>
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
                                            <th scope="col">Profile</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Contact</th>
                                            <th scope="col">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map(item => (
                                                <tr key={item.id} >
                                                    <td>{item.profile_image
                                                        ? <Image src={item.profile_image} style={{ width: "30px" }} alt="" />
                                                        : <Image src="/images/download.jpg" style={{ width: "20px" }} alt="" />
                                                    }</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.contact_no}</td>
                                                    <td>{item.address}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Container >
        </>
    )
}

export default ViewContact