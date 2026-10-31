import type { Metadata } from "next";
import SpaceWorkspace from "../../../studio/spaces/[spaceId]/workspace";
import "../../../studio/spaces/spaces.css";
import "../../../studio/studio-system.css";
import "@xyflow/react/dist/style.css";

export const metadata: Metadata = {
 title: "Guest Studio Canvas",
 description: "Interactive, local-only guest editor for Burma AI Studio. Your private workspaces stay protected.",
 robots: { index: false, follow: false },
};

export default async function PublicStudioCanvas({params}:{params:Promise<{spaceId:string}>}){
 const {spaceId}=await params;
 if(!/^[a-zA-Z0-9-]{1,80}$/.test(spaceId)){
  return <main style={{padding:40}}><h1>Invalid demo studio</h1><a href="/showcase">Return to Public Demo</a></main>;
 }
 return <SpaceWorkspace spaceId={spaceId} guest user={{
  id:"guest-demo-only",
  email:"",
  displayName:"Guest",
  role:"member"
 }}/>;
}
