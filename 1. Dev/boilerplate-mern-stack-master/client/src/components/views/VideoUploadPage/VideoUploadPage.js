import React from 'react'
import { Typography, Button, Form, message, Input} from 'antd';
import Icon from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';  // redux

const { TextArea} = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label : "Private"},
    {value: 1, label : "Publice"},
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)   // state에서 user정보를 가지고 온다!
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("File & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("");

    
    const CategoryOptions = [
        { value : 0, label : "Film & Animation"},
        { value : 1, label : "Autos & Vehicles"},
        { value: 2, label : "Music"},
        { value: 3, label : "Pets & Animals"},
    ]

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header : {'content-type' : 'multipart/form-data'}
        }
        formData.append("file", files[0])
        console.log(files);

        // 리퀘스트를 서버에 보내고 받고 한다!
        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)

                let variable = {
                    url:response.data.url,
                    fileName : response.data.fileName
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data)
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)

                    } else {
                        alert('썸네일 생성에 실패 했습니다.')
                    }
                })
            } else {
                alert('비디오 업로드를 실패했습니다.')
            }
        })
    }

    const onsubmit = (e) => {
        e.preventDefault(); // 원래 클릭을 하면은 하려고 햇던것들을 방지 할 수 있다!
        const variables = {
            writer : user.userData._id,
            title : VideoTitle,
            description : Description,
            privacy : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail : ThumbnailPath,
        }
        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success) {
                message.success('성공적으로 업로드를 했습니다.')

                // 3초 뒤에 메인 페이지로 이동을 시켜준다!
                setTimeout(() => {
                    props.history.push('/')
                }, 3000)
            } else {
                alert('비디오 업로드에 실패 했습니다.')
            }
        })
    }

  return (
    <div style={{ maxWidth : '700px', margin : '2rem auto'}}>
        <div style = {{ textAlign : 'center', marginBottom : '2rem' }} >
            <Title level={2}>Upload Video</Title>
        </div>

        <Form onSubmit = {onsubmit}>
            <div style = {{ display : 'flex', justifyContent : 'space-between'}}>
                {/* Drop zone */}
                <Dropzone
                    onDrop = {onDrop}
                    multiple = {false}  // 파일을 한개만 한다? flase, 여러개로 올린다? true
                    maxSize = {1000000000}
                >
                    {({ getRootProps, getInputProps}) => (
                        <div style = {{ width:'300px', height:'240px', border:'1px solid lightgray',
                                        display : 'flex', alignItems:'center', justifyContent:'center'}}
                                    {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize:'3rem'}} />
                            {/* <PlusOutlined style={{ fontSize:'3rem'}} /> */}
                        </div>
                    )}
                </Dropzone>
                {/* Thuimbnail */}

                {/* 썸네일 패스값이 존재 할 경우에만 썸네일을 표시해라! */}
                {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                    </div>
                }

            </div>
            <br />
            <br />
            <label>Title</label>
            <Input
                onChange = {onTitleChange}
                value = {VideoTitle}
            />
            <br />
            <br />
            <label>Description</label>
            <TextArea
                onChange = {onDescriptChange}
                value = {Description}
            />
            <br />
            <br />

            <select onChange = {onPrivateChange}>
                {PrivateOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>

            <br />
            <br />
            <select onChange = {onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br />
            <br />
            <Button type="primary" size="large" onClick={onsubmit}>
                Submit
            </Button>
        </Form>
      
    </div>
  )
}

export default VideoUploadPage;