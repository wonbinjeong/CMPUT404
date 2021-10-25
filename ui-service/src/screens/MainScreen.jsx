import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { CreatePostModal } from '../components/CreatePostModal';
import { Link } from 'react-router-dom'

export const MainScreen = () => {
    const [posts, setPosts] = useState([]);
    const [commentInputField, setCommentInputField] = useState({});
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchPosts();
    }, [])

    const fetchPosts = async () => {
        try{
            let response = await axios.get("http://localhost:8080/service/author")
            let data = response.data
            console.log(data)
            console.log("fetching posts")
            
            setPosts(data)
        }
        catch(err){
            console.log(err)
            alert(err)
        }
    }

    const commentChangeHandler = (postID, comment) => {
        setCommentInputField({
            ...commentInputField,
            [postID]: comment,
        })
        console.log(commentInputField)
    }

    const submitCommentHandler = async (postID, username) => {
        let message = commentInputField[postID]
        try{
            await axios.post(`https://localhost:8080/post/${postID}/comment`, {
                message: message,
                username: username,
            })
        }
        catch(err){
            console.log(err)
            alert(err)
        }
        fetchPosts();
    }

    const createNewPostHandler = async (title, content, tags) => {
        console.log("Clicked?!")
        alert("Create New Post Clicked!")
        setShowModal(false);
        fetchPosts();
    }

    const reactionClickHandler = async (postID, reactionType) => {
        alert("Reaction Clicked!")
        fetchPosts();
    }
    
    return(
        <>
        <Link to="/Friend">
            <button className="btn btn-md btn-secondary">Go to Friend</button>
        </Link>
        <Link to="/Post">
            <button className="btn btn-md btn-secondary" href="/Post">Go to Post</button>
        </Link>

        <Link to="/Inbox">
            <button className="btn btn-md btn-secondary" href="/Inbox">Go to Inbox</button>
        </Link>


        <CreatePostModal isVisible={showModal} setVisible={setShowModal} submitPostHandler={createNewPostHandler}></CreatePostModal>
        <div className="text-center my-5" style={{backgroundColor: "rgb(21,32,43)"}}>
            <button className="btn btn-primary btn-lg w-50" style={{backgroundColor: "rgb(255,122,0)"}} onClick={() => setShowModal(true)}>Create New Post</button>
            {posts.map((post, i) => 
            <div className=" w-50 mt-3 mx-auto border p-4 rounded-5 z-depth-2 text-white"
            style={{backgroundColor: "rgb(30,47,65)"}} key={"post"+i}>
                {/* Title Section */}
                <div className="row" style={{textAlign: 'left'}}>
                    <h5><b>{post.title}</b></h5>
                    <h6 style={{fontStyle: "italic",color: "rgb(255,122,0)"}}>{post.username} </h6>
                </div>
                {/* Content Section */}
                <div className="row rounded rounded-5 py-2 px-4" style={{backgroundColor: "rgb(30,47,65)"}}>
                    {post.content}
                </div>
                
                {/* Comment Section */}
                <div className="mt-2 mx-2">
                    {post.comments.map((comment, i) => 
                        <div key={"comment_"+i}>
                            <div className="column my-2 px-5 text-start">
                                <div className="col-3 bg-grey" style={{fontStyle: "italic",color: "rgb(255,122,0)"}}>
                                    {comment.username}
                                </div>
                                <div className="col text-start">
                                    {comment.message}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="row px-5 py-2">
                        Comment: <input type="text" id={"comment_"+post.postID} className="form-control-sm" onInput={(e) => commentChangeHandler(post.postID, e.target.value)}></input>
                        <div className="col text-end">
                            <button className="btn" onClick={() => {
                                submitCommentHandler(post.postID, "dummy_username")
                            }}>Submit</button>
                        </div>
                    </div>
                    {/* Tag Section */}
                <div className="row my-1">
                    <p className="text-grey">
                    Tags: 
                    {post.tags.map((tag, i) => 
                        <button key={"button"+i}
                            className="btn btn-sm btn-warning mx-1"
                            onClick={() => {
                                alert("Sorry! This hasn't been implemented yet")
                            }}
                        >{tag}</button>
                    )}
                    </p>
                </div>
                {/* React Section */}
                <div className="row my-2">
                    <div className="col mx-0">
                        <button className="btn btn-sm btn-primary mx-1"
                            onClick={() => {
                                reactionClickHandler(post.postID, "like")
                            }}>
                            <i className="far fa-thumbs-up fa-1x"></i>+{post.reaction.like}
                        </button>
                        <button className="btn btn-sm btn-danger mx-1"
                            onClick={() => {
                                reactionClickHandler(post.postID, "love")
                            }}>
                            <i className="far fa-heart fa-1x"></i>+{post.reaction.love}
                        </button>
                        <button className="btn btn-sm btn-secondary mx-1"
                            onClick={() => {
                                reactionClickHandler(post.postID, "rocket")
                            }}>
                            <i className="fas fa-rocket fa-1x"></i>+{post.reaction.rocket}
                        </button>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
        </>
    )
}