import { AppointmentTooltip } from '@devexpress/dx-react-scheduler';
import { Box, Grid, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createTimeRange from 'utils/createTimeRange';
import { getDisciplineInfo } from 'pages/SchedulePage/store/actions';
import { useStyles } from './styles';
import { selectDisciplines } from 'pages/SchedulePage/store/selectors';

const ToolTipContent = ({
  appointmentData: {
    startDate,
    endDate,
    name,
    classroom,
    teacher,
    isOnline,
    isOnceAMonth,
    groups,
    type,
  },
}: AppointmentTooltip.ContentProps) => {
  const styles = useStyles();
  const groupSet = useMemo(
    () => groups.map(({ name }) => name).join(', '),
    [groups]
  );
  const time = useMemo(
    () => createTimeRange({ startDate, endDate }),
    [startDate, endDate]
  );

  return (
    <Paper padding='0 8px 8px'>
      <Grid container spacing={3} className={styles.noMargin}>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            variant='h5'
            component='h2'
            className={styles.alignedHeader}
          >
            {time}{' '}
            <Box className={styles.alignedHeader} ml='8px'>
              <AccessTimeIcon />
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom variant='body2' component='p'>
            Subject:{' '}
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            {name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom variant='body2' component='p'>
            Classroom:{' '}
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            {classroom}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom variant='body2' component='p'>
            Teacher:{' '}
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            {teacher}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom variant='body2' component='p'>
            Type:{' '}
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            {type}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            gutterBottom
            variant='body2'
            component='p'
            className={styles.alignedHeader}
          >
            <span className={styles.spacingRight}>Online: </span>
            {isOnline ? (
              <DoneIcon color='primary' />
            ) : (
              <CloseIcon color='error' />
            )}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            gutterBottom
            variant='body2'
            component='p'
            className={styles.alignedHeader}
          >
            <span className={styles.spacingRight}>Once a month: </span>
            {isOnceAMonth ? (
              <DoneIcon color='primary' />
            ) : (
              <CloseIcon color='error' />
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            variant='body2'
            component='p'
            className={styles.alignedHeader}
          >
            <span className={styles.spacingRight}>Groups: </span>
            {groupSet}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ToolTipContent;
