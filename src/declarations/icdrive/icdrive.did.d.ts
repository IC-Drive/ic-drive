import type { Principal } from '@dfinity/principal';
export type FileCanister = Principal;
export type FileCanister__1 = Principal;
export interface Profile {
  'id' : UserId__1,
  'userName' : UserName,
  'name' : string,
  'createdAt' : bigint,
  'email' : string,
  'updateCanister' : boolean,
  'fileCanister' : FileCanister,
}
export type UserId = Principal;
export type UserId__1 = Principal;
export type UserName = string;
export type UserName__1 = string;
export interface icdrive {
  'addFeedback' : (arg_0: string) => Promise<undefined>,
  'checkUserName' : (arg_0: UserName__1) => Promise<boolean>,
  'createProfile' : (arg_0: UserName__1, arg_1: string) => Promise<
      [] | [Principal]
    >,
  'getAdmin' : () => Promise<Principal>,
  'getCanister' : (arg_0: UserId) => Promise<[] | [FileCanister__1]>,
  'getFeedback' : (arg_0: string) => Promise<Array<string>>,
  'getProfile' : () => Promise<[] | [Profile]>,
  'getPublicFileLocation' : (arg_0: string) => Promise<[] | [string]>,
  'getTempNewEmails' : (arg_0: string) => Promise<Array<string>>,
  'getUserCanister' : (arg_0: UserName__1) => Promise<[] | [FileCanister__1]>,
  'getUserCount' : (arg_0: string) => Promise<bigint>,
  'getUserName' : (arg_0: UserId) => Promise<[] | [UserName__1]>,
  'makeFilePublic' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'updateDone' : () => Promise<[] | [null]>,
  'userProfile' : (arg_0: string) => Promise<Array<[UserId, Profile]>>,
}
export interface _SERVICE extends icdrive {}
