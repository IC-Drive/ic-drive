import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

export const httpAgent = async() =>{
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });
  return icdrive
}
