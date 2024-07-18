import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_LOCAL_URL })

export const loginUser = (bodyData) => async (dispatch) => {
    try {
        const { data } = await API.post('/user/login', bodyData)
        console.log(data, "============> Data");
    }
    catch (error) {
        console.log(error);
        return { message: error.message }
    }

}