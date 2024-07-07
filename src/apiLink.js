// const baseURL = `https://test.onsaemiro.site/api`; // 기본 api 주소
const baseURL = `https://test.onsaemiro.site/api`;
export const API = {
    // 회원 관련 API
    "manageRegister": `${baseURL}/member/register/manager`, // 관리자 회원가입
    "manageDoubleCheck" : `${baseURL}/member/auth/login/doublecheck`, // 아이디 중복체크
    "departmentGetList": `${baseURL}/member/auth/department/all`, // 부서 리스트

    // 로그인 및 로그아웃 관련 API
    "loginAdmin": `${baseURL}/member/auth/login/manager`, // 관리자 로그인
    "manageLogout": `${baseURL}/member/manager/manager/logout`, // 로그아웃
    "refreshToken": `${baseURL}/member/auth/newtoken`, // 토큰 재발급
 
    // 유저 프로필 관련 API
    "userProfileList": `${baseURL}/member/user/management/department/get`, // 유저 프로필 리스트 조회
    "userProfileCreate": `${baseURL}/member/register/user`, // 유저 프로필 등록
    "userProfileUpdate": `${baseURL}/member/user/change`, // 유저 프로필 수정
    "getUserLoginCode": `${baseURL}/member/auth/user/loginCode`, // 유저 로그인 코드 조회
    "deleteUserProfile": `${baseURL}/member/user/delete`, // 유저 프로필 삭제

    // 유저 답변 페이지 관련 API
    "userSurveyAnswer": `${baseURL}/survey/answer`, // 유저 답변 페이지 조회

    // 카테고리 관련 API
    "getCategorySurveyList": `${baseURL}/survey/get/category`, // 카테고리별 설문 리스트 조회
    "createCategory": `${baseURL}/survey/category/management`, // 카테고리 추가
    "modifyCategory": `${baseURL}/survey/category/management/change`, // 카테고리 수정
    "deleteCategory": `${baseURL}/survey/category/management/delete`, // 카테고리 삭제
    "getCategoryList": `${baseURL}/survey/category/get`, // 카테고리 리스트 조회
    "userCategoryCreate": `${baseURL}/member/user/management/add/category`, // 유저 카테고리 업데이트

    // 질문 관련 API
    "createSurvey": `${baseURL}/survey/management/add`, // 설문 추가
    "modifySurvey": `${baseURL}/survey/management/change`, // 설문 수정
    "deleteSurvey": `${baseURL}/survey/management/delete`, // 설문 삭제
    "changeSurveyOrder": `${baseURL}/survey/management/num/change`, // 질문 순서 변경
    "getSurveyData": `${baseURL}/survey/get/id`, // 설문 데이터 조회
    "setPersonalSurvey": `${baseURL}/survey/management/update/userSurveyList`,

    // 유저 요구사항 관련 API
    "getRequirementList": `${baseURL}/request/get/all/bymanager`, // 요구사항 리스트 조회
    "getNewRequirementList": `${baseURL}/request/get/new`, // 새로운 요구사항 리스트 조회
    "checkRequirement": `${baseURL}/request/check`, // 요구사항 확인
    "deleteRequirement": `${baseURL}/request/delete`, // 요구사항 삭제



    
};
