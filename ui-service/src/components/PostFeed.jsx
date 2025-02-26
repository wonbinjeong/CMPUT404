import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { WithContext as ReactTags } from 'react-tag-input';
import { Link } from 'react-router-dom'
import axios from 'axios'

Modal.setAppElement('#root');

const customStyles = {
    content: {
        width: '60%',
        marginLeft: "auto",
        marginRight: "auto",
    },
};


export const PostFeed = (props) => {
    
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [commentInputField, setCommentInputField] = useState({});
    

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


    const reactionClickHandler = async (postID, reactionType) => {
        alert("Reaction Clicked!")
        fetchPosts();
    }

    return (
        <div id={PostFeed}>
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
                {/* React Section */}
                <div className="row my-2">
                    <div class="btn-group-sm shadow-0 col" role="group">
                        <button type="button" class="btn btn-dark shadow-0" style={{backgroundColor: "rgb(30,47,65)"}}data-mdb-color="dark"
                        onClick={() => {
                                reactionClickHandler(post.postID, "like")
                            }}>
                            <i className="far fa-thumbs-up fa-1x"></i>+{post.reaction.like}</button>
                        <button type="button" class="btn btn-dark shadow-0" style={{backgroundColor: "rgb(30,47,65)"}}data-mdb-color="dark"
                             onClick={() => {
                                reactionClickHandler(post.postID, "love")
                            }}>
                            <i className="far fa-heart fa-1x"></i>+{post.reaction.love}
                            </button>
                        <button type="button" class="btn btn-dark shadow-0" style={{backgroundColor: "rgb(30,47,65)"}}data-mdb-color="dark"
                        onClick={() => {
                                reactionClickHandler(post.postID, "rocket")
                            }}>
                            <i className="fas fa-rocket fa-1x"></i>+{post.reaction.rocket}
                        </button>
                    </div>

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
                
                </div>
            </div>
            )}

        </div>
       
     );
}