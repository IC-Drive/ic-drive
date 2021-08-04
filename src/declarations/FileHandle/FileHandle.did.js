export const idlFactory = ({ IDL }) => {
  const UserName__1 = IDL.Text;
  const FileId__1 = IDL.Text;
  const FileInfo = IDL.Record({
    'userName' : UserName__1,
    'madePublic' : IDL.Bool,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'mimeType' : IDL.Text,
    'fileHash' : IDL.Text,
    'fileSize' : IDL.Nat,
    'sharedWith' : IDL.Vec(UserName__1),
    'fileId' : FileId__1,
    'chunkCount' : IDL.Nat,
    'marked' : IDL.Bool,
  });
  const FileInit = IDL.Record({
    'name' : IDL.Text,
    'mimeType' : IDL.Text,
    'fileSize' : IDL.Nat,
    'sharedWith' : IDL.Vec(UserName__1),
    'chunkCount' : IDL.Nat,
    'marked' : IDL.Bool,
  });
  const UserName = IDL.Text;
  const FileId = IDL.Text;
  const FileHandle = IDL.Service({
    'addSharedFile' : IDL.Func([FileInfo], [], []),
    'createFile' : IDL.Func([FileInit, UserName], [IDL.Opt(FileId)], []),
    'createOwner' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'deleteFile' : IDL.Func([FileId], [IDL.Opt(IDL.Null)], []),
    'deleteSharedFile' : IDL.Func([FileId], [IDL.Opt(IDL.Null)], []),
    'getCanisterID' : IDL.Func([], [IDL.Principal], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFileChunk' : IDL.Func(
        [FileId, IDL.Nat],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ['query'],
      ),
    'getFiles' : IDL.Func([], [IDL.Opt(IDL.Vec(FileInfo))], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getPublicFileChunk' : IDL.Func(
        [FileId, IDL.Nat],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ['query'],
      ),
    'getSharedFileChunk' : IDL.Func(
        [FileId, IDL.Nat, UserName],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ['query'],
      ),
    'makeFilePublic' : IDL.Func([FileId, IDL.Text], [IDL.Opt(IDL.Null)], []),
    'markFile' : IDL.Func([FileId], [IDL.Opt(IDL.Null)], []),
    'putFileChunk' : IDL.Func([FileId, IDL.Nat, IDL.Vec(IDL.Nat8)], [], []),
    'removeFilePublic' : IDL.Func([FileId], [IDL.Opt(IDL.Null)], []),
    'shareFile' : IDL.Func(
        [FileId, UserName, UserName],
        [IDL.Opt(IDL.Text)],
        [],
      ),
  });
  return FileHandle;
};
export const init = ({ IDL }) => { return []; };
