import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';  // 댓글
import ReplyComment from './ReplyComment';    // 대댓글

function Comment(props) {
  const postId = props.postId;                         // 비디오 ID
  const user = useSelector((state) => state.user);      // Redux를 이용하여, Login한 유저의 정보를 가져온다!
  const [commentValue, setCommentValue] = useState(); // 댓글

  const handleClick = (e) => {
      setCommentValue(e.currentTarget.value);
  }

  const onSubmit = (e) => {
    // 댓글 버튼 클릭 시, 새로고침 방지
    e.preventDefault();

    const variables = {
        content : commentValue      // 댓글
      , writer : user.userData._id  // Login 한 유저의 ID
      , postId : postId             // 비디오 ID
    }

    // 입력한 사람의 정보, 코멘트의 내용 여러가지 정보를 DB에 넣어줘야함
    Axios.post('/api/comment/saveComment', variables)
    .then((response) => {
      if(response.data.success) {
        // console.log(response.data.result)
        setCommentValue("");
        props.refreshFunction(response.data.result) // 부모컴포넌트 DB에 저장된 댓글 정보를 전달해줌.
      } else {
        alert('코멘트를 저장하지 못했습니다.')
      }
    })
  }

  return (
    <div>
      {/* Coment Lists */}
      {props.commentLists &&
        props.commentLists.map((comment, index) => (
          !comment.responseTo && (
            <React.Fragment key={index}>
              <SingleComment
                refreshFunction={props.refreshFunction}
                comment={comment}
                postId={postId}
                key={index}
              />
              <ReplyComment
                refreshFunction={props.refreshFunction}
                commentLists={props.commentLists}
                parentCommentId = {comment._id}
                postId={postId}
              />
            </React.Fragment>
          )
      ))}

      {/* Root Comment Form */}

      <form style={{ display : 'flex'}} onSubmit={onSubmit} >
        <textarea
          style = {{ width : '100%', borderRadius : '5px' }}
          onChange={handleClick}
          value={commentValue}
          placeholder='코멘트를 작성해 주세요'
        />
        <br />
        <button style ={{ width : '20%', height : '52px' }} onClick={onSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default Comment
