import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import {
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
} from '@mui/material';

import { API } from '../../../../apiLink';
import { getRequestApi, getDefaultRequestApi, postRequestApi } from '../../../../apiRequest';

import PersonalUserList from './userList/personalUserList';
import PersonalSurveyList from './surveyList/personalSurveyList';

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
};

const modalMenuBar = {
  p: 2,
  width: '100%',
  height: '90px',
  display: 'flex',
  borderTop: '1px solid lightgray',
  fontWeight: 'bold',
  flexDirection: 'row',
  alignItems: 'center',
  float: 'right',
  justifyContent: 'space-between'
};

export default function ModalSetPersonalSurvey() {
  const navigate = useNavigate();
  // 선택된 데이터
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState([]);
  // 받아온 데이터
  const [userList, setUserList] = useState([]);
  const [surveyList, setSurveyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const findUserData = (id) => { // 선택된 사용자의 정보를 찾음 - 모달 바 하단 프로필용
    if (userList.length > 0) {
      return userList.find(user => user.id === id);
    }
    return null;
  };

  const fetchData = useCallback(async () => { // 
    const cookies = new Cookies();
    const errMsgUserProfiles = 'Error : getUserProfiles';
    const errMsgSurveyData = 'Error : [SurveyListpage] fetchSurveyData';
    const params = { departmentId: cookies.get('departmentId') };

    try {
      const accessTkn = await cookies.get('accessToken');
      const refreshTkn = await cookies.get('refreshToken');

      if (!accessTkn || !refreshTkn) {
        console.error(errMsgSurveyData, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
        navigate('/login', { replace: true });
        return;
      }

      const response = await getRequestApi(API.userProfileList, params, errMsgUserProfiles, navigate, accessTkn, refreshTkn);
      if (response.status === 200 && response.data.userList !== undefined) {
        setUserList(response.data.userList);
      } else {
        console.error(errMsgUserProfiles, '지정되지 않은 에러');
      }

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

  const isSelectUser = useCallback(async () => {
    const errMsg = 'Error : is_selectUser';
    try {
      const cookies = new Cookies();
      const accessTkn = cookies.get('accessToken');
      const refreshTkn = cookies.get('refreshToken');

      if (!accessTkn || !refreshTkn) {
        console.error(errMsg, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
        alert('로그아웃 되었습니다.');
        navigate('/login', { replace: true });
        return;
      }
      const requestApi = `${API.getUserSurveyList}/${selectedUser}`;
      const response = await getDefaultRequestApi(requestApi, errMsg, navigate, accessTkn, refreshTkn);

      if (response.status === 200) {
        setSelectedSurvey(response.data.surveyList.map(survey => survey.id));
      } else {
        console.error(errMsg, '지정되지 않은 에러');
      }
    } catch (error) {
      console.error(errMsg, error);
    }
  }, [navigate, selectedUser]);

  useEffect(() => {
    const isLogin = () => {
      const cookies = new Cookies();
      const accessTkn = cookies.get("accessToken");
      if (!accessTkn) {
        alert('로그인을 다시 해주세요!');
        navigate('/login', { replace: true });
      }
    };
    isLogin();
    fetchData();
  }, [fetchData, navigate]);

  useEffect(() => {
    if (selectedUser) {
      isSelectUser();
    } else {
      setSelectedSurvey([]);
    }
  }, [selectedUser, isSelectUser]);

  const handleSubmit = async () => {
    const errMsg = 'Error : modifyCategory';

    const formData = {
      'userId': selectedUser,
      'surveyIdList': selectedSurvey
    };

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

  const user = selectedUser ? findUserData(selectedUser) : null;

  return (
    <>
      <Box sx={modalBoxStyle}>
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>개인질문 설정</Typography>
          <Typography variant="h6" gutterBottom>사용자 선택</Typography>

          <PersonalUserList USERLIST={userList} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

          <Typography variant="h6" gutterBottom>질문 선택</Typography>
          

          <PersonalSurveyList SURVEYLIST={surveyList} CATEGORY={categoryList} selectedSurvey={selectedSurvey} setSelectedSurvey={setSelectedSurvey} status={selectedUser !== null }/>
        </Box>
        <Box sx={modalMenuBar}>
          <Box sx={{ width: '25%', p: 1, border: '1px solid grey', borderRadius: '8px' }}>
            {user ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar alt={user.userName} />
                <Typography variant="h6">{user.userName}</Typography>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar />
                <Typography variant="h6">사용자를 선택해주세요</Typography>
              </Stack>
            )}
          </Box>
          {selectedUser && (
            selectedSurvey.length === 0 
              ? '질문을 선택해주세요' 
              : `선택됨: ${selectedSurvey.length} / 전체: ${surveyList.length}`
          )}
          <Button
            variant="contained"
            sx={{ height: 'fit-content', float: 'right' }}
            onClick={handleSubmit}
            disabled={!selectedUser || selectedSurvey.length === 0} // 조건에 따라 버튼 비활성화
          >
            업데이트
          </Button>
        </Box>
      </Box>
    </>
  );
}