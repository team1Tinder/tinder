import React, {useState, useEffect} from 'react'
import '../../style/mypage.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SideBar from '../SideBar';
import { useSelector } from 'react-redux';


const MyPage = () => {

    const loginUser = useSelector( state=>state.user );
    const [ imgSrc, setImgSrc ]=useState('');
    const navigate=useNavigate();
    const [word, setWord] = useState('n');
    const [imgList, setImgList] = useState([]);

    
    useEffect(
        ()=>{
            if( loginUser.profileImg ){
                setImgSrc(`http://localhost:8070/userImg/${loginUser.profileImg}`);
            }
        
        },[]
    )

    return (
        <div className='mypage'>
            <SideBar  setWord={setWord}/>
            <div className='userinfo'>
                <div className='img'>
                    <img src={imgSrc} />
                </div>
                <div className='profile'>
                    <div className='field'>
                        <label>E-mail</label>
                        <div>{loginUser.email}</div>
                    </div>
                    <div className='field'>
                        <label>Nick Name</label>
                        <div>{loginUser.nickname}</div>
                    </div>
                    <div className='field'>
                        <label>Follower</label>
                        <div>
                            {
                                (loginUser.follower)?(loginUser.follower.length):(0)
                            }
                        </div>
                    </div>
                    <div className='field'>
                        <label>Followed</label>
                        <div>
                            {
                                (loginUser.followed)?(loginUser.followed.length):(0)
                            }
                        </div>
                    </div>
                    <div className='field'>
                        <label>intro</label>
                        <div>{loginUser.profileMsg}</div>
                    </div>
                </div>
            </div>

            <div className='btns' >
                <div id ="btn" onClick={()=>{ navigate('/editProfile')}}>Edit Profile</div>
                <div id ="btn">Post Write</div>
            </div>


         

            {/* <div className='userpost' >
                {
                    (imgList)?(
                        imgList.map((imgs, idx)=>{
                            return (
                                <div key={idx}>
                                    <img src={`http://localhost:8070/images/${imgs}`} />
                                </div>
                            )
                        })
                    ):(<div>Loading...</div>)
                }
            </div> */}
        </div>
    )
}

export default MyPage
