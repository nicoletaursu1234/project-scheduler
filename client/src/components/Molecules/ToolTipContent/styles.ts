import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(() => ({
  alignedHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  noMargin: {
    margin: 0,
  },
  spacingRight: {
    paddingRight: '8px',
  },
}));