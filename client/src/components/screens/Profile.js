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
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px grey color"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={state?state.pic:""}
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{pics.length} post</h6>
                        <h6>{state?state.followers.length:" "} followers</h6>
                        <h6>{state?state.following.length:" "} following</h6>
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