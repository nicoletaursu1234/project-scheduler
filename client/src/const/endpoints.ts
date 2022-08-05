//TODO add correct endpoints

enum Endpoints {
  UserGet = "/user",
  UserCreate = "/user/signup",
  UserUpdate = "/user",
  AvatarUpdate = "/user/avatar",
  SignIn = "/user/login",
  Calendar = "/calendar",
  CalendarPost = "/calendar/new",
  CalendarsGet = "/calendar/all",
  MemberInvite = "/calendar/member/invite",
  MemberRemove = "/calendar/member/remove",
  Activity = "/activity",
  ActivitiesGet = "/activity/all",
  CommentsGet = "/message/activity",
  CommentPost = "/message/activity",
  CommentDelete = "/message",
};

export default Endpoints;
