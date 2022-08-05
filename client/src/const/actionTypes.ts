enum ActionTypes {
  GetGroups = 'groups/get-entities',
  GetGroupsFail = 'groups/get-entities-fail',

  CreateDiscipline = 'disciplines/create',
  CreateDisciplineFail = 'disciplines/create-fail',

  GetDisciplinesByGroup = 'disciplines/get-by-group',
  GetDisciplinesByGroupFail = 'disciplines/get-by-fail',

  GetDisciplineInfo = 'disciplines/get-info',
  GetDisciplineInfoFail = 'disciplines/get-info-fail',
}

export default ActionTypes;