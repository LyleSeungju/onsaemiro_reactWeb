import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';


import {
    Box,
    Button
} from '@mui/material';

import SurveySelectForm from './surveySelectForm';
import SurveyInputForm from './surveyInputForm';
import PreviewSurveySlide from '../previewSurvey/previewSurveySlide';

import { getDefaultRequestApi, multiFormRequestApi } from '../../../../apiRequest';
import { API } from '../../../../apiLink';
// import { getCookie } from '../../../auth/cookie/cookie';

const style = {
    width: '600px',
    height: '770px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

SurveyForm.propTypes = {
    status: PropTypes.bool,
    mode: PropTypes.bool,
    closeModal: PropTypes.func,
    reload: PropTypes.func,
}


export default function SurveyForm({status, mode, closeModal, reload}) {
    const navigate = useNavigate();
    const [categorySelect, setCategorySelect] = useState([]);

    const initialInputs =  {
        question: "",
        categoryId: 0,
        userLevel: 1,
        type: 0,
        imageUrl: null,
        answers: [
            { answer: "", imageUrl: null },
            { answer: "", imageUrl: null }
        ]
    };

    
    const [inputs, setInputs] = useState(initialInputs);

    const [slidePreview, setPreview] = useState(false);
    const prevClick = () => setPreview(!slidePreview);


    const handleSubmit = async() => {
        const errMsg = 'Error : [CreateSurveyForm] handleSubmit';
        const formData = new FormData();

        if (inputs.userLevel === 1) {
            const allAnswersHaveImages = inputs.answers.every(answer => answer.imageUrl !== null && answer.imageUrl !== undefined);
            if (inputs.imageUrl === null || !allAnswersHaveImages) {
                alert('모든 질문과 답변에는 이미지가 포함되어야 합니다.');
                return;
            }
        }

        formData.append('request', JSON.stringify({
            question: inputs.question,
            categoryId: inputs.categoryId,
            userLevel: inputs.userLevel,
            type: 1,
            hasImage: inputs.imageUrl !== null,
            answers: inputs.answers.map(answer => ({
                answer: answer.answer,
                hasImage: answer.imageUrl !== null && answer.imageUrl !== undefined
            }))
        }));

        if (inputs.imageUrl !== null) { // 질문 이미지 추가
            formData.append('images', inputs.imageUrl);
        }  

        inputs.answers.forEach((answer) => { // 답변 이미지 추가
            if (answer.imageUrl !== null) {
                formData.append('images', answer.imageUrl);
            }
        });

        try {
            const cookies = new Cookies();
            const accessTkn = await cookies.get('accessToken');
            const refreshTkn = await cookies.get('refreshToken'); // accessTkn, refreshTkn
            if (!accessTkn || !refreshTkn) {
                console.error(errMsg, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
                alert('로그아웃 되었습니다.');
                navigate('/login', { replace: true });
                return;
            }
            const response = await multiFormRequestApi(API.createSurvey, formData, errMsg, navigate, accessTkn, refreshTkn);
            if (response.status === 200) {
                // 성공적으로 등록
                alert('새로운 질문이 추가되었습니다.');

                // 입력 초기화
                reload();
                setPreview(false); // 미리보기 닫기
                setInputs(initialInputs);   
                setCategorySelect([]);
                closeModal();
              } 
        } catch (error) {
            console.error(errMsg, error);
            alert('질문 추가에 실패했습니다. 다시 시도해주세요');
        }
    };

    
    useEffect(() => {
        const getCategoryList = async () => {
            const errMsg = 'Error : getCategoryList';
            try {
                const cookies = new Cookies();
                const accessTkn = await cookies.get('accessToken');
                const refreshTkn = await cookies.get('refreshToken');
        
                // 쿠키 값이 undefined인 경우, 사용자에게 알리고 로그인 페이지로 리다이렉션
                if (!accessTkn || !refreshTkn) {
                    console.error(errMsg, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
                    alert('로그아웃 되었습니다.');
                    navigate('/login', { replace: true });
                    return;
                }
                const response = await getDefaultRequestApi(API.getCategoryList, errMsg, navigate, accessTkn, refreshTkn);
                
                if (response.status === 200 && response.data.categoryList !== undefined) {
                    setCategorySelect(response.data.categoryList);
                    if (!response.data.categoryList.some(category => category.id === inputs.categoryId)) {
                        setInputs(inputs => ({ ...inputs, categoryId: '' }));
                    }
                } else {
                console.error(errMsg, '지정되지 않은 에러');
                }
            } catch (error) {
                console.error(errMsg, error);
            }
        };
    
        getCategoryList();
      }, [navigate, inputs.categoryId, setInputs]);


    

    return (
        <Box sx={style} display={status ? 'block':'none'}>
            <Box sx={{ width: '532px', height: '673px', overflow:'hidden'}}>
                <Box sx={{display:slidePreview? 'none':'block'}}>
                    <span style={{fontSize: '24px', fontWeight:'bold'}}>{mode ? '새로운 질문 생성하기':'질문 수정하기'}</span>
                    <Button variant='outlined' sx={{float:'right', margin:'5px',}} display={mode ? 'block':'none'} disabled>설정</Button>

                    <SurveySelectForm inputs={inputs} setInputs={setInputs} category={categorySelect}/>
                    <SurveyInputForm inputs={inputs} setInputs={setInputs}/>
                </Box>
            
                <PreviewSurveySlide status={slidePreview} data={inputs} />
            </Box>
            <Button variant='contained' sx={{ float:'right', mt:'15px'}} onClick={handleSubmit}  disabled={inputs.type === 0}>{mode ? '추가하기':'수정하기'}</Button>
            <Button variant='outlined' sx={{ width:'88px', float:'right', mt:'15px', mr:'10px'}} onClick={prevClick} disabled={inputs.type === 0}>{slidePreview? '닫기':'미리보기'}</Button>
        </Box>
    ); 
}