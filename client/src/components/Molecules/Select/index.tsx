import { InputLabel, MenuItem, FormHelperText } from '@material-ui/core';
import React, { useState } from 'react';

import { StyledSelect, StyledFormControl } from './styled';

export default ({ groups, ...props }) => {
  const [group, setGroup] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;

    setGroup(value);
    props.setGroup(value);
  };

  return (
    <StyledFormControl required>
      <InputLabel id='groups-label-id'>Group</InputLabel>
      <StyledSelect
        labelId='groups-label-id'
        value={group}
        onChange={handleChange}
      >
        {groups.map((grp) => (
          <MenuItem key={grp.id} value={grp.id}>
            {grp.name}
          </MenuItem>
        ))}
      </StyledSelect>
      <FormHelperText>Required</FormHelperText>
    </StyledFormControl>
  );
};
