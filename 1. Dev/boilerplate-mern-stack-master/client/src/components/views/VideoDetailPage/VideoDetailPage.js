import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar} from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'    // 오른쪽 비디오들
import Subscribe from './Sections/Subscribe'    // 구독
import Comment from './Sections/Comment'        // 댓글

function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoId  // Video ID 값 가져오기!
    const variable = { videoId : videoId }      // videoId : videoId 값
    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail)   // routes/video.js에서 전달 한 videoDetail값
            } else {
                alert('비디오 정보를 가져오길 실패했습니다.')
            }
        })
    }, [])

    if(VideoDetail.writer) {

        //만약 페이지의 동영상이 본인의 동영상이면 구독버튼을 안보이게만든다.
        const subscribeButton = VideoDetail.writer._id !==
        localStorage.getItem('userId') && (
            <Subscribe
            userTo={VideoDetail.writer._id}
            userFrom={localStorage.getItem('userId')}
            />
        );
        //witer를 서버에서 가져오기전에 페이지를 렌더링 할려고해서
        //VideoDetail.writer.image 부분에서 type error가 발생한다.
        return (
            <Row gutter = {[16, 16]}>
                <Col lg={18} xs={24}>
        
                <div style={{ width : '100%', padding : '3rem 4rem' }}>
                    <video style = {{ width : '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
        
                    <List.Item
                        actions={[subscribeButton]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src ={VideoDetail.writer.image} />}
                            title={VideoDetail.writer.name}
                            description={VideoDetail.description}
                        />
                    </List.Item>
        
                    {/* Comment */}
                    <Comment />
        
                </div>
        
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
          )
    } else {
        return (
            <div>...loading</div>
        )
    }


}

export default VideoDetailPage
