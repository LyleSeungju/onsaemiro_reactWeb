import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
  Modal,Box,
  
} from '@mui/material'; // TablePagination,


// sections
import SurveyToolbar from '../sections/@dashboard/survey/surveyToolBar';
import { SurveyList,SurveyHead } from '../sections/@dashboard/survey/index';
import ModalAddSurvey from '../sections/@dashboard/survey/addSurvey';
import ModalSeqSurvey from '../sections/@dashboard/survey/seqSurvey/seqSurvey';
import PreviewSurveyModal from '../sections/@dashboard/survey/previewSurvey/previewSurveyModal';
import ModalModifySurvey from '../sections/@dashboard/survey/modifySurvey';
import ModalSetCategory from '../sections/@dashboard/survey/setCategory/setCategory';
import ModalSetPersonalSurvey from '../sections/@dashboard/survey/personalSurvey/ModalSetPersonalSurvey';
// api request
import { API } from '../apiLink';
import { getDefaultRequestApi } from '../apiRequest';




// 메인 함수 
export default function UserPage() {
  
  const [filterName, setFilterName] = useState('');

  const handleFilterByName = () => {  
  ;setFilterName('');
  };

  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([{id: ''}]);
  const [surveyList, setSurveyList] = useState([]);


  const fetchSurveyData = useCallback(async () => {
    const errMsg = 'Error : [SurveyListpage] fetchSurveyData';

    try {
      const cookies = new Cookies();
      const accessTkn = await cookies.get('accessToken');
      const refreshTkn = await cookies.get('refreshToken');

      // 쿠키 값이 undefined인 경우, 사용자에게 알리고 로그인 페이지로 리다이렉션
      if (!accessTkn || !refreshTkn) {
          console.error(errMsg, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
          navigate('/login', { replace: true });
          return;
      }
      const categoryResponse = await getDefaultRequestApi(API.getCategoryList, errMsg, navigate, accessTkn , refreshTkn );
      setCategoryList(categoryResponse.data.categoryList);

      setSurveyList([]);
      categoryResponse.data.categoryList.forEach(async (category) => {
        const surveyResponse = await getDefaultRequestApi(`${API.getCategorySurveyList}/${category.id}`, errMsg, navigate, accessTkn , refreshTkn);
        // console.log("surveyResponse ",surveyResponse.data);
        setSurveyList(surveyList => [...surveyList, ...surveyResponse.data.surveyList]);
      });
    } catch (error) {
      console.error(errMsg, error);
    }
  }, [navigate, setCategoryList, setSurveyList]);
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

    fetchSurveyData();
  }, [fetchSurveyData, navigate]);

  


  const [modalState, setModalState] = useState({ status: false, val: '' });
  const openModal = (val) => setModalState({ status: true, val });
  const closeModal = () => setModalState({ status: false, val: '' });

  const [surveyData, setSurveyData] = useState({});
  const setDatas = (data) => setSurveyData(data);
  // const resetDatas = () => setSurveyData({});

  // 삭제 팝업
  
  

  useEffect(() => {
  }, [modalState]);

  return (
    <>
      <Helmet>
        <title> 질문 관리 | 온새미로 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom mt={3} >
            질문리스트 조회 및 생성
          </Typography>
        </Stack>

        <Card>
          <Modal open={modalState.status} onClose={closeModal} aria-labelledby="surveyModal">
            <Box>
              {modalState.val === 'add' && <ModalAddSurvey status={modalState.status} close={closeModal} reload={fetchSurveyData}/>}
              {modalState.val === 'seq' && <ModalSeqSurvey status={modalState.status} surveys={surveyList} categoryList={categoryList} />}
              {modalState.val === 'preview' && <PreviewSurveyModal status={modalState.status} data={surveyData} /> }
              {modalState.val === 'modify' && <ModalModifySurvey status={modalState.status} data={surveyData} close={closeModal} reload={fetchSurveyData}/> }
              {modalState.val === 'category' && <ModalSetCategory /> }
              {modalState.val === 'personal' && <ModalSetPersonalSurvey />}
            </Box>
          </Modal>

          <SurveyToolbar  filterName={filterName} onFilterName={handleFilterByName} /> {/* numSelected={selected.length} */}
          <SurveyHead addClick={()=>openModal('add')} seqClick={()=>openModal('seq')} categoryClick={()=>openModal('category')} personalClick={()=>openModal('personal')}/>
          
          <SurveyList prevClick={()=>openModal('preview')} modifyClick={()=>openModal('modify')} setData={setDatas} categoryList={categoryList} surveyList={surveyList} />

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={surveyData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>
      </Container>

      
    </>
  );
}
