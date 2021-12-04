import NavBar from "./components/Navbar";
import "./App.css"
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import {BrowserRouter,Route, Routes, useNavigate} from 'react-router-dom'
import Login from './components/screens/Login'
import Home from './components/screens/Home'
import Register from './components/screens/Register'
import Profile from './components/screens/Profile'
import UserProfile from './components/screens/UserProfile'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";

export const UserContext = createContext()

const Routing = ()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{navigate("/login")}
  },[])
  return(
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/subsposts" element={<SubscribedUserPosts />} />
      </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value = {{state,dispatch}}>
    <BrowserRouter>
    <NavBar />
      <Routing/>

    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
