import PropTypes from 'prop-types';
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
import PersonalUserListHead from './personalUserListHead';
import PersonalUserListBody from './personalUserListBody';

// ----------------------------------------------------------------------

PersonalUserList.propTypes = {
  USERLIST: PropTypes.array,
  selectedUser: PropTypes.string,
  setSelectedUser: PropTypes.func,
};

// 메인 함수
export default function PersonalUserList({ USERLIST, selectedUser, setSelectedUser }) {
  const [order, setOrder] = useState('asc');
  // const [selected, setSelectedUser] = useState(null); // 변경: 배열 대신 단일 값으로 초기화
  const [orderBy, setOrderBy] = useState('name');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    if (selectedUser === name) {
      setSelectedUser(null); // 이미 선택된 항목을 클릭하면 선택 해제
    } else {
      setSelectedUser(name); // 새로운 항목을 클릭하면 해당 항목 선택
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <Scrollbar>
        <TableContainer sx={{ maxHeight: 200 }}>
          <Table>
            <PersonalUserListHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <PersonalUserListBody
              users={USERLIST}
              order={order}
              orderBy={orderBy}
              selected={selectedUser}
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
