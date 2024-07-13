import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';


import { Box, Container, TextField, Slider, Select, MenuItem, Checkbox, ListItemText, InputLabel, Divider, Button } from '@mui/material';

import { API } from '../../../../../apiLink';
import { getDefaultRequestApi, postRequestApi } from '../../../../../apiRequest';
// import { getCookie } from '../../../../auth/cookie/cookie';


ModifyForm.propTypes = {
    userData: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired,
};

export default function ModifyForm({ userData, setUserData,  }) { 
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState(userData.categoryList.map(category => category.id));
    const [categoryList, setCategoryList] = useState([{}]); //

    const handleChange = (prop) => (event) => {
        setUserData({ ...userData, [prop]: event.target.value });
    };

    const handleSelectChange = (event) => {
        setSelectedOptions(event.target.value);
        
    };

    const handleSetCategory = async () => {
        const errMsg = 'Error : handleSetCategory';
        const requestData = {
            userId: userData.id,
            categoryIdList: selectedOptions
        };
        try {
            const cookies = new Cookies();
            const accessTkn = await cookies.get('accessToken');
            const refreshTkn = await cookies.get('refreshToken'); // 
            if (!accessTkn || !refreshTkn) {
                console.error(errMsg, '접근 토큰 또는 갱신 토큰이 유효하지 않습니다. 다시 로그인이 필요합니다.');
                alert('로그아웃 되었습니다.');
                navigate('/login', { replace: true });
                return;
            }
            const response = await postRequestApi(API.userCategoryCreate, JSON.stringify(requestData), errMsg, navigate, accessTkn, refreshTkn);
            if (response.status === 200) {
                alert('카테고리가 설정되었습니다.');
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            } else {
                console.error(errMsg, '지정되지 않은 에러');
            }
        } catch (error) {
            console.error(errMsg, error);
        }
    };

    const getCategoryList = async () => {
        const errMsg = 'Error : getCategoryList';
        
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
            const response = await getDefaultRequestApi(API.getCategoryList, errMsg, navigate, accessTkn, refreshTkn);

            if (response.status === 200 && response.data.categoryList !== undefined) {
                setCategoryList(response.data.categoryList);
            } else {
            console.error(errMsg, '지정되지 않은 에러');
            }
        } catch (error) {
            console.error(errMsg, error);
        }
    };

    useEffect(() => {
        getCategoryList();
    // eslint-disable-next-line
    }, []);

    return (
        <Container id="form" maxWidth="sm" sx={{ width: '484px' }}>
            <Box sx={{ position: 'relative', left: '-25%' }}>
                <TextField
                    id="name-input"
                    label="이름(성함)"
                    type="text"
                    margin="normal"
                    fullWidth
                    variant="standard"
                    value={userData.userName}
                    onChange={handleChange('userName')}
                />
                <TextField
                    id="address-input"
                    label="주소"
                    type="text"
                    margin="normal"
                    fullWidth
                    variant="standard"
                    value={userData.userAddress}
                    onChange={handleChange('userAddress')}
                />
                <TextField
                    id="birth-input"
                    label="생년월일"
                    type="date"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={userData.userBirth}
                    onChange={handleChange('userBirth')}
                />
                <TextField
                    id="phone-input"
                    label="전화번호"
                    type="tel"
                    margin="normal"
                    fullWidth
                    variant="standard"
                    sx={{ mb: 2}}
                    inputProps={{ maxLength: 11, pattern: "\\d{11}" }}
                    placeholder="01012345678"
                    helperText="전화번호를 - 빼고 입력해주세요.  (예: 01012345678)"
                    value={userData.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                />
                <span style={{ color:'#637381', lineHeight: '1.4375em', fontSize: '14px', fontWeight: '400', marginTop: '5px'}}>중증도 단계:  { userData.userLevel }</span>   
                <Slider
                    
                    label="중증도"
                    value={userData.userLevel}
                    onChange={handleChange('userLevel')}
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    max={2}
                />
                <Divider sx={{ mt: 3, mb: 3, borderWidth: 1, borderColor: 'gray' }} />
                <InputLabel id="multiple-checkbox-label">카테고리 설정</InputLabel>
                <Select
                    multiple
                    value={selectedOptions}
                    onChange={handleSelectChange}
                    displayEmpty 
                    renderValue={() =>
                        "카테고리를 선택해주세요."
                      }
                >
                    {categoryList.map((category, index) => (
                        <MenuItem key={index} value={category.id}>
                            <Checkbox checked={selectedOptions.includes(category.id)} />
                            <ListItemText primary={category.name} />
                        </MenuItem>
                    ))}
                </Select> 
                <Button sx={{ float: 'right', mt: '5px', fontSize: '15px' }} onClick={()=>handleSetCategory()}>카테고리 설정</Button>              
            </Box>
        </Container>
    );
}
