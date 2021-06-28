import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

export const httpAgent = async() =>{
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const icdriveAgent = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });
  return icdriveAgent
}

export const canisterHttpAgent = async() =>{
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const userCanisterId = localStorage.getItem('userCanisterId');
  const userAgent = Actor.createActor(icdrive_idl, { agent, canisterId: userCanisterId });
  console.log(userAgent)
  return userAgent
}
