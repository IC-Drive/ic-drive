export const idlFactory = ({ IDL }) => {
  const UserName__1 = IDL.Text;
  const UserId = IDL.Principal;
  const FileCanister__1 = IDL.Principal;
  const UserId__1 = IDL.Principal;
  const UserName = IDL.Text;
  const FileCanister = IDL.Principal;
  const Profile = IDL.Record({
    'id' : UserId__1,
    'userName' : UserName,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'email' : IDL.Text,
    'updateCanister' : IDL.Bool,
    'fileCanister' : FileCanister,
  });
  const icdrive = IDL.Service({
    'addFeedback' : IDL.Func([IDL.Text], [], []),
    'checkUserName' : IDL.Func([UserName__1], [IDL.Bool], ['query']),
    'createProfile' : IDL.Func(
        [UserName__1, IDL.Text],
        [IDL.Opt(IDL.Principal)],
        [],
      ),
    'getAdmin' : IDL.Func([], [IDL.Principal], ['query']),
    'getCanister' : IDL.Func([UserId], [IDL.Opt(FileCanister__1)], ['query']),
    'getFeedback' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getProfile' : IDL.Func([], [IDL.Opt(Profile)], ['query']),
    'getPublicFileLocation' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getTempNewEmails' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getUserCanister' : IDL.Func(
        [UserName__1],
        [IDL.Opt(FileCanister__1)],
        ['query'],
      ),
    'getUserCount' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'getUserName' : IDL.Func([UserId], [IDL.Opt(UserName__1)], ['query']),
    'makeFilePublic' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateDone' : IDL.Func([], [IDL.Opt(IDL.Null)], []),
    'userProfile' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(UserId, Profile))],
        ['query'],
      ),
  });
  return icdrive;
};
export const init = ({ IDL }) => { return []; };
