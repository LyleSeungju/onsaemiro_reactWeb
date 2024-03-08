// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [[
  {
    title: '사용자 프로필',
    path: '/dashboard/userProfile',
    icon: icon('ic_analytics'),
  },
  {
    title: '질문 리스트',
    path: '/dashboard/surveyList',
    icon: icon('ic_cart'),
  },
  {
    title: '사용자 요구사항',
    path: '/dashboard/requirement',
    icon: icon('ic_user'),
  },
  // {
  //   title: '관리자 권한 승인 ',
  //   path: '/dashboard/adminAuth',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: '통계',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // }
  ],
  // [ {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // }]
];

export default navConfig;
