import type { Principal } from '@dfinity/principal';
export interface FileHandle {
  'addSharedFile' : (arg_0: FileInfo) => Promise<undefined>,
  'createFile' : (arg_0: FileInit, arg_1: UserName) => Promise<[] | [FileId]>,
  'createOwner' : (arg_0: Principal) => Promise<Principal>,
  'deleteFile' : (arg_0: FileId) => Promise<[] | [null]>,
  'deleteSharedFile' : (arg_0: FileId) => Promise<[] | [null]>,
  'getCanisterID' : () => Promise<Principal>,
  'getCycles' : () => Promise<bigint>,
  'getFileChunk' : (arg_0: FileId, arg_1: bigint) => Promise<
      [] | [Array<number>]
    >,
  'getFiles' : () => Promise<[] | [Array<FileInfo>]>,
  'getOwner' : () => Promise<Principal>,
  'getPublicFileChunk' : (arg_0: FileId, arg_1: bigint) => Promise<
      [] | [Array<number>]
    >,
  'getSharedFileChunk' : (
      arg_0: FileId,
      arg_1: bigint,
      arg_2: UserName,
    ) => Promise<[] | [Array<number>]>,
  'makeFilePublic' : (arg_0: FileId, arg_1: string) => Promise<[] | [null]>,
  'markFile' : (arg_0: FileId) => Promise<[] | [null]>,
  'putFileChunk' : (
      arg_0: FileId,
      arg_1: bigint,
      arg_2: Array<number>,
    ) => Promise<undefined>,
  'removeFilePublic' : (arg_0: FileId) => Promise<[] | [null]>,
  'shareFile' : (arg_0: FileId, arg_1: UserName, arg_2: UserName) => Promise<
      [] | [string]
    >,
}
export type FileId = string;
export type FileId__1 = string;
export interface FileInfo {
  'userName' : UserName__1,
  'madePublic' : boolean,
  'name' : string,
  'createdAt' : bigint,
  'mimeType' : string,
  'fileHash' : string,
  'fileSize' : bigint,
  'sharedWith' : Array<UserName__1>,
  'fileId' : FileId__1,
  'chunkCount' : bigint,
  'marked' : boolean,
}
export interface FileInit {
  'name' : string,
  'mimeType' : string,
  'fileSize' : bigint,
  'sharedWith' : Array<UserName__1>,
  'chunkCount' : bigint,
  'marked' : boolean,
}
export type UserName = string;
export type UserName__1 = string;
export interface _SERVICE extends FileHandle {}
