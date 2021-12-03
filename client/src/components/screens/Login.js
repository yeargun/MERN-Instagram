import React,{useState,useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../../App.js'
import M from 'materialize-css'
const Login = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const Navigate = useNavigate()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const PostData= ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes:"red"})
            return
        }
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"red"})
            }
            else{
                M.toast({html:"logged in successfuly", classes:"grey"})
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",paylod:data.user})
                Navigate('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card">
            <h2>Surd</h2>
            <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
             <button className="btn waves-effect waves-light black"
             onClick={()=>PostData()}>Login
            </button>
            <h5>
                <Link to="/register">Register</Link>
            </h5>
            
      </div>
        </div>
    )
}


export default Login