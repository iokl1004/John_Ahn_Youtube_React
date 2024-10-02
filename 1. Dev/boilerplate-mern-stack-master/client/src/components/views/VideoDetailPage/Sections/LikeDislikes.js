import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {LikeOutlined, DislikeOutlined} from '@ant-design/icons';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0);                  // 좋아요 갯수
    const [DisLikes, setDisLikes] = useState(0);            // 싫어요 갯수
    const [LikeAction, setLikeAction] = useState();         // 좋아요 눌렀는지 판단 여부 변수
    const [DisLikeAction, setDisLikeAction] = useState();   // 싫어요 눌렀는지 판단 여부 변수

    let variable = {}

    if(props.video) {
        variable = { videoId: props.videoId, userId : props.userId}
    } else {
        variable = { commentID: props.commentId, userId : props.userId}
    }

    // 좋아요/싫어요 가져오기
    useEffect(() => {
        // 좋아요
        Axios.post('/api/like/getLikes', variable)
        .then(response=> {
            if(response.data.success) {
                // 얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)

                // 내가 이미 해당 좋아요를 눌렀는지
                response.data.likes.map(like => {
                    // props.userId는 내 자신
                    // 해당 영상 좋아요를 클릭한 Id들
                    if(like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })
            } else {
                alert('Likes에 정보를 가져오는데 실패 하였습니다.')
            }
        })

        // 싫어요
        Axios.post('/api/like/getDisLikes', variable)
        .then(response=> {
            if(response.data.success) {
                // 얼마나 많은 싫어요를 받았는지
                setLikes(response.data.dislikes.length)

                // 내가 이미 해당 싫어요를 눌렀는지
                response.data.dislikes.map(dislike => {
                    // props.userId는 내 자신
                    // 해당 영상 싫어요를 클릭한 Id들
                    if(dislike.userId === props.userId) {
                        setLikeAction('disliked')
                    }
                })
            } else {
                alert('DisLikes에 정보를 가져오는데 실패 하였습니다.')
            }
        })

    }, [])

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip tile="Like">
                    <LikeOutlined
                        theme={LikeAction === "liked" ? 'filled' : 'outlined'}
                        onClick
                    />
                </Tooltip>
                <span style = {{ paddingLeft : '8px', cursor : 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <DislikeOutlined
                        theme={DisLikeAction === "disliked" ? 'filled' : 'outlined'}
                        onClick
                    />
                    {/* <Icon type="dislike"
                        theme="<LikeOutlined />"
                        onClick
                    /> */}
                </Tooltip>
                <span tyle = {{ paddingLeft : '8px', cursor : 'auto' }}> {DisLikes} </span>
            </span>
        
        </div>
    )
}

export default LikeDislikes