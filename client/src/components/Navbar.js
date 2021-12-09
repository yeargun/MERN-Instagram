import React,{useContext, useRef, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
import SwitchSelector from "react-switch-selector";
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./GlobalStyle";
import { lightTheme, darkTheme } from "./Themes"
const NavBar=()=>{
  const searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const {state,dispatch} = useContext(UserContext)
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate()
  const [userDetails,setUserDetails] = useState([])
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  const renderList = ()=>{
    if(state){
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:'black'}}>search</i></li>,
        <li key="2"><Link to="/create">Create Post</Link></li>,
        <li key="3"><Link to="/profile">Profile</Link></li>,
        <li key="4"><Link to="/subsposts">Feed</Link></li>,
        <li key="5">
          <button style={{marginRight:"5px"}}
            className="btn waves-effect waves-light black"
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
        <li key="6"><Link to="/login">Login</Link></li>,
        <li key="7"><Link to="/register">Register</Link></li>
      ]
    }
  }

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
}

  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
  }

  const options = [
    {
        label: <span>empty</span>,
        value: {
             foo: true
        },
        selectedBackgroundColor: "#0097e6",
    },
    {
        label: "for now",
        value: "bar",
        selectedBackgroundColor: "#fbc531"
    }
 ];
 
 const onChange = (newValue) => {
     console.log(newValue);
 };
 
 const initialSelectedIndex = options.findIndex(({value}) => value === "bar");
 

    return(
      <div className="navbar-fixed">
        <nav>
        <div className="nav-wrapper white" style={{width: "100%"}}>

          <div style={{width: "30%", height:"0"}}> 

        
      
            <Link to={state?"/":"/login"} className="brand-logo left">Surd</Link> 
        

            <div style={{ "margin": "0px 0px 0px 30%",width: "40%", height:"40px"}}> 
              <SwitchSelector style={{ "margin": "55px 0px 0px 0px"}}
                onChange={onChange}
                options={options}
                initialSelectedIndex={initialSelectedIndex}
                backgroundColor={"#353b48"}
                fontColor={"#f5f6fa"}
              />
            </div>

            
          
          </div>
          <ul id="nav-mobile" className="right">
              {renderList()}
            </ul>
          
          <div style={{ "margin": "0px 0px 0px 50%",width: "50%", height:"10%"}}>
            
            
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
            <input 
              type="text"
              placeholder="search"
              value={search}
              onChange={(e)=>fetchUsers(e.target.value)}
            />
            <ul className="collection">

            {userDetails.map(item=>{
              return (<Link to={item._id !== state._id?"/profile/"+item._id:"/profile"} onClick={()=>{
                M.Modal.getInstance(searchModal.current).close()
                setSearch("")
              }}><li className="collection-item">{item.email}</li></Link>)
              
            })}

            </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>close</button>
          </div>
        </div>
        
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <>
    <GlobalStyles/>
    <i className="small material-icons" style={{color:'black'}}
    onClick={themeToggler}>{theme==='light'? "airline_seat_individual_suite" : "brightness_5"}</i>

    </>
    </ThemeProvider>
          </div>
        </div>
      </nav>
    </div>
    )
}
export default NavBar