import PropTypes from 'prop-types';
import React from 'react';
import { filter } from 'lodash';
import {
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Typography,
  Checkbox,
  Paper,
} from '@mui/material';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PersonalUserListBody({ users, order, orderBy, filterName, selected, onClick, page, rowsPerPage }) {
  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  const isNotFound = !filteredUsers.length && !!filterName;
  return (
    <TableBody>
      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        const { id, userName, userLevel, userBirth, categoryList } = row;
        const selectedUser = selected === id;
        const category = categoryList.map(item => item.name).join(',');


        return (
          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
            <TableCell padding="checkbox">
              <Checkbox checked={selectedUser} onChange={(event) => onClick(event, id)} />
            </TableCell>

            <TableCell component="th" scope="row" padding="none">
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* <Avatar alt={userName} src={`${imageUrl}${index}`} /> */}
                <Typography variant="subtitle2" noWrap>
                  {userName}
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="left">{userLevel}</TableCell>
            <TableCell align="left">{userBirth}</TableCell>
            <TableCell align="left">{category}</TableCell>
          </TableRow>
        );
      })}
      {emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      )}

      {isNotFound && (
        <TableRow>
          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
            <Paper
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" paragraph>
                사용자를 불러들이지 못했습니다.
              </Typography>

              <Typography variant="body2">
                해당 이름을 검색하지 못했습니다. &nbsp;
                <strong>&quot;{filterName}&quot;</strong>.
                <br /> 입력한 이름을 다시 확인해주세요.
              </Typography>
            </Paper>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

PersonalUserListBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    userLevel: PropTypes.number.isRequired,
    userBirth: PropTypes.string.isRequired,
    categoryList: PropTypes.array.isRequired,
    imageUrl: PropTypes.string,
  })).isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  selected: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
