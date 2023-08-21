import React from 'react';
import Typography from '@mui/material/Typography';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  title: {
    fontWeight: 'bold'
  }
}));

const SectionHeader = (props) => {
  const classes = useStyles(props.theme);
  const { title, subtitle} = props;
  return (
    <>
      <Typography variant="subtitle1" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {subtitle}
      </Typography>
    </>
  )
}

export default withRouter(SectionHeader);