import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
// @mui
import {
  Typography,
  Button,
  Box,
} from '@mui/material';

// functions
import { API } from '../../../../apiLink';
import { getRequestApi, getDefaultRequestApi, postRequestApi } from '../../../../apiRequest';

// sections
import PersonalUserList from './userList/personalUserList'; 
import PersonalSurveyList from './surveyList/personalSurveyList';

// ----------------------------------------------------------------------


const modalBoxStyle = {
  width: '80%',
  height: '95%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
}

const modalMenuBar = {
  p: 2,
  width: '100%', 
  height: '80px',
  borderTop: '1px solid lightgray', 
  fontWeight: 'bold',
  alignItems: 'center', 
  float:'right',
  justifyContent: 'space-between' 
};



// 메인 함수
export default function ModalSetPersonalSurvey() {
  const navigate = useNavigate();
  // 선택된 데이터
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState([]);
  // 받아오는 데이터
  const [userList, setUserList] = useState([]);
  const [surveyList, setSurveyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  
  const fetchData = useCallback(async () => {
  const cookies = new Cookies();
  const errMsgUserProfiles = 'Error : getUserProfiles';
  const errMsgSurveyData = 'Error : [SurveyListpage] fetchSurveyData';
  const params = { departmentId: cookies.get('departmentId') };

  try {
    const accessTkn = await cookies.get('accessToken');
    const refreshTkn = await cookies.get('refreshToken');

    // 쿠키 값이 undefined인 경우, 사용자에게 알리고 로그인 페이지로 리다이렉션
    if (!accessTkn || !refreshTkn) {
      console.error(errMsgSurveyData, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
      navigate('/login', { replace: true });
      return;
    }

    // 유저 리스트 받아오기
    const response = await getRequestApi(API.userProfileList, params, errMsgUserProfiles, navigate, accessTkn, refreshTkn);
    if (response.status === 200 && response.data.userList !== undefined) {
      setUserList(response.data.userList);
    } else {
      console.error(errMsgUserProfiles, '지정되지 않은 에러');
    }

    // 질문 리스트 받아오기
    const categoryResponse = await getDefaultRequestApi(API.getCategoryList, errMsgSurveyData, navigate, accessTkn, refreshTkn);
    setCategoryList(categoryResponse.data.categoryList);
    setSurveyList([]);

    const surveyPromises = categoryResponse.data.categoryList.map(async (category) => {
      const surveyResponse = await getDefaultRequestApi(`${API.getCategorySurveyList}/${category.id}`, errMsgSurveyData, navigate, accessTkn, refreshTkn);
      return surveyResponse.data.surveyList;
    });

    const surveyResults = await Promise.all(surveyPromises);
    const allSurveys = surveyResults.flat();
    setSurveyList(allSurveys);
  } catch (error) {
    console.error(errMsgUserProfiles, error);
    console.error(errMsgSurveyData, error);
  }
}, [navigate, setUserList, setSurveyList]);

  

  useEffect(() => {
    const isLogin = () => {
      const cookies = new Cookies();
      const accessTkn = cookies.get("accessToken");
      if (!accessTkn) {
        alert('로그인을 다시 해주세요!');
        navigate('/login', { replace: true });
      }
    }
    isLogin();
    fetchData()
  }, [fetchData, navigate]);

  const handleSubmit = async () => { // 카테고리 이름 변경 저장
    const errMsg = 'Error : modifyCategory';
  
    const formData = {
      'userId': selectedUser,
      'surveyIdList': selectedSurvey
    }

    try {
        const cookies = new Cookies();
        const accessTkn = await cookies.get('accessToken');
        const refreshTkn = await cookies.get('refreshToken');
        if (!accessTkn || !refreshTkn) {
            console.error(errMsg, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
            alert('로그아웃 되었습니다.');
            navigate('/login', { replace: true });
            return;
        }

        const response = await postRequestApi(API.setPersonalSurvey, JSON.stringify(formData), errMsg, navigate, accessTkn, refreshTkn);
        if (response.status === 200) {
            alert('성공적으로 업데이트 되었습니다.');
        } else {
            alert('업데이트 실패 다시 시도해주세요');
        }
    } catch (error) {
        console.error("Error Set personalSurvey", error);
    }
  };
  return (
    <>
      <Box sx={modalBoxStyle}>
        <Box sx={{ padding: 4}}>
          <Typography variant="h4" gutterBottom>개인질문 설정</Typography>
          <Typography variant="h6" gutterBottom>사용자 선택</Typography>

          <PersonalUserList USERLIST={userList} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

          <Typography variant="h6" gutterBottom>질문 선택</Typography>

          <PersonalSurveyList SURVEYLIST={surveyList} CATEGORY={categoryList} selectedSurvey={selectedSurvey} setSelectedSurvey={setSelectedSurvey}/>
        </Box>
        <Box sx={modalMenuBar}>
          {/* <Box sx={{ width: '20%', p: 1, border: '1px solid grey', borderRadius: '8px' }}>
          {selectedUser ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar alt={selectedUser.name} src={selectedUser.avatarUrl} />
              <Typography variant="h6">{selectedUser.name}</Typography>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src='' />
              <Typography variant="h6">사용자를 선택해주세요</Typography>
            </Stack>
          )}
        </Box>   */}

            {/* 29개 질문 중 25개 선택됨 */}
          <Button variant="contained" sx={{ height: 'fit-content', float:'right' }} onClick={handleSubmit}>
            업데이트
          </Button>
        </Box>
      </Box>
      
    </>
  );
}
