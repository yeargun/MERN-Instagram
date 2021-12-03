import React,{useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../App'
const NavBar=()=>{
  const {state,dispatch} = useContext(UserContext)
  const navigate = useNavigate()
  const renderList = ()=>{
    if(state){
      return [
        <li key="1"><Link to="/create">Create Post</Link></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3">
          <button className="btn waves-effect waves-light black"
             onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              navigate("/login")
             }
             }>logout
            </button>
        </li>
        
      ]
    }
    else{
      return [
        <li key="4"><Link to="/login">Login</Link></li>,
        <li key="5"><Link to="/register">Register</Link></li>
      ]
    }
  }
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/login"} className="brand-logo left">Surd</Link> 
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}
export default NavBar