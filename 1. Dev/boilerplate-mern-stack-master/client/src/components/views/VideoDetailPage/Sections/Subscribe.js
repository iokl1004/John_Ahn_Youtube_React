import Axios from 'axios'
import React, { useState, useEffect } from 'react'

function Subscribe(props) {
    
    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false); // 해당 유튜버 구독 유무

    useEffect(() => {
        // 해당 영상의 구독자 수 가져오기
        let variable = { userTo : props.userTo}

        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then((response) => {
            if(response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber)
            } else {
                alert('구독자 수 정보를 받아오지 못했습니다.')
            }
        })

        // 내가 정말 해당 영상을 구독을 하고 있는지?
        let subscribedVariable = { userTo : props.userTo, userFrom : localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then((response) => {
            if(response.data.success) {
                setSubscribed(response.data.subscribed);
            } else {
                alert('정보를 받아오지 못했습니다.')
            }
        })
    }, [])
    
    // 구독하기
    const onSubscribe = () => {
        let subscribedVariable = {
              userTo: props.userTo
            , userFrom: props.userFrom
        };
        
        if (Subscribed) {
            //이미구독중이라면
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                 .then((response) => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('구독 취소 하는데 실패 했습니다.');
                    }
                }
            )
        } else {
            //구독중이 아니라면
            Axios.post('/api/subscribe/Subscribe', subscribedVariable)
                 .then((response) => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('구독 하는데 실패 했습니다.');
                    }
                }
            )
        }
    };

    return (
        <div>
            <button
                style ={{
                      backgroundColor : `${Subscribed ? '#AAAAAA' : '#CC0000'}`
                    , borderRadius: '4px'
                    , color: 'white'
                    , padding : '10px 16px'
                    , fontWeight : '500'
                    , fontSize : '1rem'
                    , textTransform : 'uppercase'
                }}
                onClick={onSubscribe}
            >
            {/* 구독을 하고 있을경우 "Subscribed", 안하고 있을경우 "Subscribe" */}
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
