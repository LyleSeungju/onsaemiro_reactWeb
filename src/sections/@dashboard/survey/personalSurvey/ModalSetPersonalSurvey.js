import React, { useState } from 'react';

// @mui
import {
  Typography,
  Button,
  Box,
  Stack,
  Avatar
} from '@mui/material';
// components

// sections
import PersonalUserList from './userList/personalUserList'; 
import PersonalSurveyList from './surveyList/personalSurveyList';

import { USERLIST } from './exData';
// ----------------------------------------------------------------------


const modalBoxStyle = {
  width: '80%',
  height: '90%',
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
  p: 1,
  pl: 2, pr: 2, 
  width: '100%', 
  height: '80px',
  borderTop: '1px solid lightgray', 
  fontWeight: 'bold',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between' 
};



// 메인 함수
export default function ModalSetPersonalSurvey() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <Box sx={modalBoxStyle}>
        <Box sx={{ padding: 4}}>
          <Typography variant="h4" gutterBottom>개인질문 설정</Typography>
          <Typography variant="h6" gutterBottom>사용자 선택</Typography>

          <PersonalUserList USERLIST={USERLIST} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

          <Typography variant="h6" gutterBottom>질문 선택</Typography>

          <PersonalSurveyList />
        </Box>
        <Box sx={modalMenuBar}>
        <Box sx={{ width: '20%', p: 1, border: '1px solid grey', borderRadius: '8px' }}>
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
</Box>

          29개 질문 중 25개 선택됨
          <Button variant="contained" sx={{ height: 'fit-content' }}>
            업데이트
          </Button>
        </Box>
      </Box>
      
    </>
  );
}
