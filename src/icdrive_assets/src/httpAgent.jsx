import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';
import { idlFactory as FileHandle_idl } from 'dfx-generated/FileHandle';

export const httpAgent = async() =>{
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });
  return icdrive
}

export const canisterHttpAgent = async() =>{
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const fileCanister = localStorage.getItem('fileCanister');
  const userAgent = Actor.createActor(FileHandle_idl, { agent, canisterId: fileCanister });
  return userAgent
}

export const httpAgentIdentity = async() =>{
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const identityAgent = new HttpAgent({ identity });
  return identityAgent
}