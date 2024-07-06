import PropTypes from 'prop-types';
import React from 'react';
import { filter } from 'lodash';
import {
  TableBody,
  TableRow,
  TableCell,
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



export default function PersonalSurveyListBody({ users, order, orderBy, filterName, selected, onClick, page, rowsPerPage }) {
  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <TableBody>
      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        const { id, name, birth, category } = row;
        const selectedUser = selected.indexOf(name) !== -1;

        return (
          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
            <TableCell padding="checkbox">
              <Checkbox checked={selectedUser} onChange={(event) => onClick(event, name)} />
            </TableCell>

            <TableCell align="left">{category}</TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{birth}</TableCell>
            
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
PersonalSurveyListBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    birth: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  })).isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
