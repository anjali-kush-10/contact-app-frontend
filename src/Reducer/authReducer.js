
const authReducer = (state = { userData: null, userToken: null }, action) => {
    switch (action.type) {
        case "UPDATE_USER":
            // console.log("action.data: ", action.data);
            return { ...state, userData: action.data.data, userToken: action.data.token }
        case "LOGOUT_USER":
            return { ...state, userData: null, userToken: null }

        default:
            return state
    }
}

export default authReducer