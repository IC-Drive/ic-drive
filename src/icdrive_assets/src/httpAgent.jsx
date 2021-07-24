import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory as icdriveIdl, canisterId as icdriveId } from 'dfx-generated/icdrive';
import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle';

export const httpAgent = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const icdrive = Actor.createActor(icdriveIdl, { agent, canisterId: icdriveId });
  return icdrive;
};

export const canisterHttpAgent = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const fileCanister = localStorage.getItem('fileCanister');
  const userAgent = Actor.createActor(FileHandleIdl, { agent, canisterId: fileCanister });
  return userAgent;
};

export const httpAgentIdentity = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const identityAgent = new HttpAgent({ identity });
  return identityAgent;
};
