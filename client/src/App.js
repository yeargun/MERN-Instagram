import NavBar from "./components/Navbar";
import "./App.css"
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import {BrowserRouter,Route, Routes, useNavigate} from 'react-router-dom'
import Login from './components/screens/Login'
import Home from './components/screens/Home'
import Register from './components/screens/Register'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'

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
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<CreatePost />} />
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
