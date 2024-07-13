import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Table,
  Box,
  TableContainer,
  Typography,
} from '@mui/material';
// import Scrollbar from '../../../../../components/scrollbar';
import PersonalSurveyListHead from './personalSurveyListHead';
import PersonalSurveyListBody from './personalSurveyListBody';

PersonalSurveyList.propTypes = {
  SURVEYLIST: PropTypes.array.isRequired,
  CATEGORY: PropTypes.array.isRequired,
  selectedSurvey: PropTypes.array.isRequired,
  setSelectedSurvey: PropTypes.func.isRequired,
  status: PropTypes.bool,
};

export default function PersonalSurveyList({ SURVEYLIST, CATEGORY, selectedSurvey, setSelectedSurvey, status }) {
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
      { status ? 
        (<TableContainer sx={{ maxHeight: '370px' }}>
          <Table stickyHeader>
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
        </TableContainer>)
        :
        <Box 
      sx={{ 
        height: '370px', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" gutterBottom>
        사용자를 선택해주세요
      </Typography>
      <Typography variant="body2" color="textSecondary">
        목록에서 사용자를 선택하여 시작하세요
      </Typography>
    </Box>
      }
    </Card>
  );
}