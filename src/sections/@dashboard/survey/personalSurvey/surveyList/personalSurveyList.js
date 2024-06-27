import React, { useState } from 'react';
// @mui
import {
  Card,
  Table,
  TableContainer,
} from '@mui/material';
// components
import Scrollbar from '../../../../../components/scrollbar';
// sections
import PersonalSurveyListHead from './personalSurveyListHead';
import PersonalSurveyListBody from './personalSurveyListBody';

// ----------------------------------------------------------------------

const USERLIST = [
  {
    id: 1,
    name: 'Alice Johnson',
    birth: '1990-01-01',
    category: 'Admin',
    avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
  },
  {
    id: 2,
    name: 'Bob Smith',
    birth: '1985-05-12',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    birth: '1979-09-30',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
  },
  {
    id: 4,
    name: 'David Wilson',
    birth: '1988-07-20',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
  },
  {
    id: 5,
    name: 'Eva Green',
    birth: '1992-03-15',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
  },
  {
    id: 6,
    name: 'Alice Jodhnson',
    birth: '1990-01-01',
    category: 'Admin',
    avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
  },
  {
    id: 7,
    name: 'Bob Smidth',
    birth: '1985-05-12',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
  },
  {
    id: 8,
    name: 'Charlie Brdn',
    birth: '1979-09-30',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
  },
  {
    id: 9,
    name: 'David Wdilson',
    birth: '1988-07-20',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
  },
  {
    id: 10,
    name: 'Eva Greedn',
    birth: '1992-03-15',
    category: 'User',
    avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
  },
];

// 메인 함수
export default function PersonalSurveyList() {
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <Scrollbar>
        <TableContainer sx={{ maxHeight: 300 }}>
          <Table>
            <PersonalSurveyListHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <PersonalSurveyListBody
              users={USERLIST}
              order={order}
              orderBy={orderBy}
              selected={selected}
              onClick={handleClick}
              page={0}
              rowsPerPage={USERLIST.length}
              filterName=""
            />
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
