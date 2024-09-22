import React from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import Icon from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography
const { Meta } = Card;

function LandingPage() {
    // 비디오 정보 저장
    const [Video, setVideo] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setVideo(response.data.videos)
            } else {
                alert('비디오 가져오기를 실패 했습니다.')
            }
        })
    }, [])

    const renderCards = Video.map((video, index) => {
        // 분, 초 구하기
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        // 가장 클때는 Column 하나당 6 사이즈
        // 가장 작을때는 Column 사이즈가 24 사이즈고
        return (
            <Col lg = {6} md={8} xs={24} key={index}>
                <a href={`/video/post/${video._id}`} >
                    <div style={{ position : 'relative' }}>
                        <img style={{ width : '100%'}} src={`http://localhost:5000/${video.thumbnail}`}/>
                        <div className="duration">
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </div>
                </a>
                <br />
                <Meta
                    // 유저 이미지
                    avatar={
                        <Avatar src={video.writer.image} />
                    }
                    title={video.title}
                    description=""
                />
                <span style = {{ marginLeft : '3rem'}}>{video.writer.name} </span><br />
                <span style = {{ marginLeft : '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
            </Col>
        )

    })

    return (
        <div style = {{ width : '85%', margin : '3rem auto' }}>
            <Title level={2}> Recommended </Title>
                <hr />
                {/* Row 1개에 4개의 Column을 나오게 하기 위함. */}
                <Row gutter={[32, 16]}>
                    {renderCards}
                </Row>
        </div>
    )
}

export default LandingPage