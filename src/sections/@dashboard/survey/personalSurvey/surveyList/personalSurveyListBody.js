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

function applySortFilter(array = [], comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_survey) => _survey.question.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PersonalSurveyListBody({ surveys, categorys, order, orderBy, filterName, selected = [], onClick, page, rowsPerPage }) {
  const filteredSurveys = applySortFilter(surveys, getComparator(order, orderBy), filterName);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - surveys.length) : 0;
  const isNotFound = !filteredSurveys.length && !!filterName;

  return (
    <TableBody>
      {filteredSurveys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        const { id, question, level, categoryId } = row;
        const selectedSurvey = selected.indexOf(id) !== -1;
        const category = categorys.find(data => data.id === categoryId);
        
        return (
          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedSurvey}>
            <TableCell padding="checkbox">
              <Checkbox checked={selectedSurvey} onChange={(event) => onClick(event, id)} />
            </TableCell>

            <TableCell align="left">{category?.name || 'Unknown'}</TableCell>
            <TableCell align="left">{question}</TableCell>
            <TableCell align="left">{level}</TableCell>
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
                설문 조사를 찾을 수 없습니다.
              </Typography>

              <Typography variant="body2">
                해당 이름의 설문 조사를 찾을 수 없습니다. &nbsp;
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
  surveys: PropTypes.array.isRequired,
  categorys: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  selected: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
