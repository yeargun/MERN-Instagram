import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
const Profile = ()=>{
    const [pics,setPics]=useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result)
        })
    })
    return(
        <div stye={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px grey color"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src="https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <div style={{display:"flex", justifyContent:"space-between",width:"25%"}}>
                        <h6>40 post</h6>
                        <h6>24 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            
             
            
            
            </div>
            <div className="gallery">
            {pics.map(item=>{
                return(
                
                        <img key={item._id} src={item.photo}/>
                        
                        
               
                )
            })}  
            </div>
        </div>
    )
}


export default Profile