import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const SubscribedUserPosts = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
        //buraya data koyunca like sayisi bla bla refresh oluyor ama kyomassan baska bla blar yapcan. hangisi daha optimized.
        //yo without putting data, its faster. for some cases. seems like ^^
    },[])

    const likePost =(id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikePost =(id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost= (postId)=>{
        console.log(postId)
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer"+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return(
        <div className="subsPosts">
            {data.map(item=>{
                console.log(item.postedBy._id)
                return(
                    <div className="card home-card" key={item._id}>
                        <h5 style={{padding:"6px"}}>
                            <Link style={{fontWeight:"750"}}
                            to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}> {item.postedBy.name}</Link> 
                            {item.postedBy._id == state._id &&
                            <i className="material-icons"
                                style={{float:'right'}}
                                onClick={()=>deletePost(item._id)}>delete
                            </i>}
                        </h5>
                        <div className="card-image">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons"
                            onClick={()=>{
                                item.likes.includes(state._id)?
                                unlikePost(item._id):
                                likePost(item._id)
                            }}>{item.likes.includes(state._id)?"favorite":"favorite_border"}</i>

                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map(record=>{
                                    return(
                                        <h6>
                                        <Link style={{fontWeight:"740"}} to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id:"/profile"}> {record.postedBy.name}</Link>
                                        &nbsp;  
                                        { record.text}
                                        
                                        </h6>
                                    )
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value, item._id)
                            }}>
                            <input type="text" placeholder="add a comment"/>
                            </form>
                            </div>
                    </div>
                )
            })}  
        </div>
    )
}


export default SubscribedUserPosts