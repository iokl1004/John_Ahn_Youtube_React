import React from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector((state) => state.user);        // Login한 유저의 정보를 가져온다!
    const [OpenReply, setOpenRelpy] = useState(false);      // 대댓글 상태
    const [CommentValue, setCommentValue] = useState("")    // 대댓글

    // 대댓글 달기 버튼 클릭 시 대댓글입력 폼 유무
    const onClickReplyOpen = () => {
        setOpenRelpy(!OpenReply)
    }

    // 대댓글 값 변화
    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    // 댓글 서버에 전송
    const onSubmit = (e) => {
        e.preventDefault(); // Submit 버튼 클릭 시, 새로고침 방지

        // 입력한 사람의 정보, 코멘트의 내용 여러가지 정보를 DB에 넣어줘야함
        const variables = {
            content : CommentValue          // 대댓글
          , writer : user.userData._id      // 대댓글단 유저의 ID (Login 한 유저의 ID)
          , postId : props.postId           // 비디오 ID
          , responseTo : props.comment._id  // 댓글단 유저의 ID
        }

        Axios.post('/api/comment/saveComment', variables)
        .then((response) => {
        if(response.data.success) {
            console.log(response.data.result)
            setCommentValue("");
            setOpenRelpy(false);                        // Submit 완료 후, 코멘트 작성창 닫기!
            props.refreshFunction(response.data.result) // 상위 컴포넌트에 새로운 댓글목록을 다시 전달함.
        } else {
            alert('코멘트를 저장하지 못했습니다.')
        }})
    }

    const actions = [
        // 해당 댓글에 대한 좋아요/싫어요 가져오기
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>
        , <span
            onClick={onClickReplyOpen}
            key="comment-basic-reply-to"
        >
            Reply to
        </span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} />}
                content={<p>{props.comment.content}</p>}
            />
            
            {/* 대댓글 달기 버튼을 클릭 하였을때만 보이도록! */}
            {OpenReply && (
                <form style={{ display : 'flex'}} onSubmit={onSubmit}>
                    <textarea
                        style = {{ width : '100%', borderRadius : '5px' }}
                        onChange = {onHandleChange}
                        value = {CommentValue}
                        placeholder='코멘트를 작성해 주세요'
                    />
                    <br />
                    <button style ={{ width : '20%', height : '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            )}
        </div>
    )
}

export default SingleComment
