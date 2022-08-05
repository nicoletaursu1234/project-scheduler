import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';

import {
  FormContainer,
  Form,
  InputGroup,
  StyledTextField,
  StyledAutocomplete,
  Label,
  Button,
} from './styled';
import { Checkbox, FormControlLabel, Input } from '@material-ui/core';
import {
  createDiscipline,
  getGroups,
} from '../../../pages/SchedulePage/store/actions';
import { selectGroups } from '../../../pages/SchedulePage/store/selectors';
import { DisciplineType, WeekDay, WeekType } from '../../../const';

const DisciplineForm = ({ setFormIsOpen, groups, dispatchErr, ...props }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroups());
  }, []);

  const [newDiscipline, setNewDiscipline] = useState({
    name: '',
    longName: '',
    teacher: '',
    classroom: '',
    type: DisciplineType.Lecture,
    isOnline: false,
    week: WeekType.Every,
    isOnceAMonth: false,
    weekday: WeekDay.Mon,
    startTime: '08:00',
    endTime: '09:30',
    groups: [],
  });

  const handleClick = () => {
    dispatch(createDiscipline(newDiscipline));
    setFormIsOpen(false);
  };

  const onAutocompleteChange = useCallback((e, value) => {
    setNewDiscipline((state) => ({
      ...state,
      groups: value,
    }));
  }, []);
  
  const onChange = (e) => {
    const { name, value, type, checked } = e.currentTarget;

    if (type === 'checkbox') {
      setNewDiscipline({ ...newDiscipline, [name]: checked });
    } else {
      setNewDiscipline({ ...newDiscipline, [name]: value });
    }
  };

  return (
    <FormContainer>
      <Form>
        <Label>Add a new discipline</Label>
        <InputGroup>
          <StyledTextField
            onChange={onChange}
            name='name'
            type='text'
            value={newDiscipline.name}
            placeholder='Name of the discipline'
          />
          <StyledTextField
            onChange={onChange}
            name='longName'
            type='text'
            value={newDiscipline.longName}
            placeholder='Full name of the discipline'
          />
        </InputGroup>
        <InputGroup>
          <StyledTextField
            onChange={onChange}
            name='teacher'
            type='text'
            value={newDiscipline.teacher}
            placeholder='Name and Surname of the teacher'
          />

          <StyledTextField
            onChange={onChange}
            name='classroom'
            type='text'
            value={newDiscipline.classroom}
            placeholder='Classroom'
          />
        </InputGroup>
        <InputGroup>
          <StyledTextField
            onChange={onChange}
            name='type'
            type='text'
            value={newDiscipline.type}
            placeholder='Seminar/Lab/Lecture'
          />
          <StyledTextField
            onChange={onChange}
            name='week'
            type='text'
            value={newDiscipline.week}
            placeholder='Odd/Even/Every week'
          />
        </InputGroup>
        <InputGroup>
          <StyledTextField
            onChange={onChange}
            name='weekday'
            type='text'
            value={newDiscipline.weekday}
            placeholder='Week day'
          />
          <StyledAutocomplete
            multiple
            id='groups'
            onChange={onAutocompleteChange}
            options={groups}
            value={groups.id}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            renderInput={(params) => (
              <StyledTextField {...params} name="groups" variant='outlined' label='Groups' />
            )}
          />
        </InputGroup>
        <StyledTextField
          id='startTime'
          onChange={onChange}
          type='time'
          name='startTime'
          value={newDiscipline.startTime}
          label='Start time'
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{}}
        />
        <StyledTextField
          id='endTime'
          onChange={onChange}
          type='time'
          name='endTime'
          value={newDiscipline.endTime}
          label='End time'
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{}}
        />
        <InputGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={newDiscipline.isOnline}
                onChange={onChange}
                name='isOnline'
                color='primary'
                value={newDiscipline.isOnline}
              />
            }
            label='The discipline will be online'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newDiscipline.isOnceAMonth}
                onChange={onChange}
                name='isOnceAMonth'
                color='primary'
                value={newDiscipline.isOnceAMonth}
              />
            }
            label='The discipline will be once a month'
          />
        </InputGroup>
        <Button onClick={handleClick}>ADD</Button>
      </Form>
    </FormContainer>
  );
};

const mapStateToProps = (state) => ({
  groups: selectGroups(state),
});

export default connect(mapStateToProps)(DisciplineForm);
