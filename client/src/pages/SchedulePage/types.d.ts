import { DisciplineType, WeekDay, WeekType } from 'const';

export interface IGroup {
  id: string;
  name: string;
}

export interface IDate {
  startDate: string;
  endDate: string;
}


export interface IDiscipline {
  id: string;
  name: string;
  longName: string;
  teacher: string;
  classroom: string | number;
  type: DisciplineType;
  isOnline: boolean;
  week: WeekType;
  weekday: WeekDay;
  startTime: string;
  endTime: string;
  isOnceAMonth: boolean;
  date: IDate[];
  groups?: IGroup[];
}

export interface IDisciplineWithDate extends IDiscipline{
  startDate: string;
  endDate: string;
}

export interface IDisciplineState {
  entities: Partial<IDiscipline>[];
  disciplineInfo: any;
}

export interface IGroupsState {
  entities: IGroup[];
  errors: string[];
}

export interface ICreateDisciplineCommon {
  name: string;
  longName: string;
  teacher: string;
  classroom: string | number;
  weekday: WeekDay;
  startTime: string;
  endTime: string;
  isOnline?: boolean;
  isOnceAMonth: boolean;
  week: WeekType;
  type: DisciplineType;
}

export interface ICreateDiscipline extends ICreateDisciplineCommon {
  groups: IGroup[];
}

export interface ICreateDisciplineBody extends ICreateDisciplineCommon {
  groups: string[];
}