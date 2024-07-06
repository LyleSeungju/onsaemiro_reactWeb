import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

PersonalSurveyList.propTypes = {
  SURVEYLIST: PropTypes.array.isRequired,
  CATEGORY: PropTypes.array.isRequired,
  selectedSurvey: PropTypes.array.isRequired,
  setSelectedSurvey: PropTypes.func.isRequired,
};

// 메인 함수
export default function PersonalSurveyList({ SURVEYLIST, CATEGORY, selectedSurvey, setSelectedSurvey }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('category');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selectedSurvey.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedSurvey, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedSurvey.slice(1));
    } else if (selectedIndex === selectedSurvey.length - 1) {
      newSelected = newSelected.concat(selectedSurvey.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedSurvey.slice(0, selectedIndex), selectedSurvey.slice(selectedIndex + 1));
    }
    setSelectedSurvey(newSelected);
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
              surveys={SURVEYLIST}
              categorys={CATEGORY}
              order={order}
              orderBy={orderBy}
              selected={selectedSurvey}
              onClick={handleClick}
              page={0}
              rowsPerPage={SURVEYLIST.length}
              filterName=""
            />
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
