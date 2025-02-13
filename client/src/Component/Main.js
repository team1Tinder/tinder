import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

import SideBar from './SideBar';
import Post from './post/Post';
import Notification from './notification/Notification'
import ToastPopupPost from './post/ToastPopupPost';
import MatchingMember from './match/MatchingMember';

import '../style/mystargram.css';
import '../style/posts.css';

const Main = () => {

    const [postList, setPostList ] = useState([]);
    const [postOne, setPostOne ] = useState();
    const navigate = useNavigate();
    const [followed, setFollowed]=useState([]);
    const [paging, setPaging] = useState({})
    const [word, setWord] = useState('n')
    const loginUser = useSelector(state=>state.user);
    const [notificationList,setNotificationList] = useState();
    const [oppositeGender, setOppositeGender] = useState();

    useEffect(
        ()=>{
            // setFollower( [...loginUser.follower] )

            axios.get(`/api/post/getPostList`, {params:{word,page:1}})
            .then((result)=>{
                // console.log("result"+JSON.stringify(result));
                setPostList( result.data.postList2 );
            }).catch((err)=>{console.error(err)})

            axios.get(`/api/post/getPostOneWithin3daysOrderByRand`)
            .then((result)=>{  
                // console.log( JSON.stringify(result.data.postOne) )          
                setPostOne( result.data.postOne );
                
            }).catch((err)=>{console.error(err)})

            axios.get(`/api/member2/getOppositeGender`, { params: { gender:loginUser.gender, age:loginUser.age } })
            .then((result) => {
                console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
                setOppositeGender(result.data.oppositeGender);
            })
            .catch((err) => { console.error(err); });

            axios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
            .then((result)=>{
            console.log("getNotificationTop4"+result.data.notificationList)
            setNotificationList(result.data.notificationList)
            }
            ).catch((err)=>{console.error(err)}) 


            


        }, [word]
    )


    const [showToast1, setShowToast1] = useState(false);
    const [showToast2, setShowToast2] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000); // 초기 5초
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        if (postOne) {
            setShowToast1(true);
            startTimer(5000); // 처음 5초 설정
        }

        const timer = setTimeout(() => {
            setShowToast2(true);
        }, 6000);

    }, [postOne]);

    const startTimer = (time) => {
        if (timerId) clearTimeout(timerId); // 기존 타이머 제거
        const id = setTimeout(() => setShowToast1(false), time);
        setTimerId(id);
        setRemainingTime(time);
    };

    const pauseTimer = () => {
        if (timerId) {
            clearTimeout(timerId);
            setTimerId(null);
        }
    };

    const resumeTimer = () => {
        startTimer(remainingTime);
    };

    const [isAnimationEnded, setIsAnimationEnded] = useState(false);

    const handleAnimationEnd = () => {
        setIsAnimationEnded(true);
    };







    return (
        <div className='Container'>

            <Notification setNotificationList={setNotificationList} notificationList={notificationList}/>
            
            {showToast1 && (
                <div
                    className="toastPopup1"
                    onMouseEnter={pauseTimer}  // 마우스 오버 시 타이머 중단
                    onMouseLeave={resumeTimer} // 마우스 떠날 때 남은 시간부터 다시 시작
                    onAnimationEnd={handleAnimationEnd} // 애니메이션 종료 후 처리
                    style={{ pointerEvents: isAnimationEnded ? 'none' : 'auto' }} 
                >
                    <div className='toastPopup1Title'>오늘의 추천 맴버</div>
                    <MatchingMember oppositeGender={oppositeGender}/>
                </div>
            )}

            {showToast2 && (
                <div
                    className="toastPopup2"
                    onMouseEnter={pauseTimer}  // 마우스 오버 시 타이머 중단
                    onMouseLeave={resumeTimer} // 마우스 떠날 때 남은 시간부터 다시 시작
                    onAnimationEnd={handleAnimationEnd} // 애니메이션 종료 후 처리
                    style={{ pointerEvents: isAnimationEnded ? 'none' : 'auto' }} 
                >
                    <div className='toastPopup2Title'>오늘의 추천 포스트</div>
                    <Post post={postOne}  followed={followed}  setFollowed={setFollowed} />
                    
                </div>
            )}

            

            <div className='left'>
                <SideBar />
            </div>
            
            {/* post */}
            <div className='PostList'>
                    {
                        (postList)?(
                            postList.map((post, idx)=>{
                                return (
                                    <Post key={idx} post={post}  followed={followed}  setFollowed={setFollowed} />
                                )
                            })
                        ):(null)
                    }
            </div>

        </div>
    )
}

export default Main
