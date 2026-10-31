import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSpacesUser } from "../lib/spaces-auth";
import LoginForm from "./login-form";
import EmailLoginForm from "./email-login-form";
import { emailAuthEnabled } from "../lib/member-auth";
import "./login.css";

export const metadata: Metadata = { title: "Private Beta Login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getSpacesUser()) redirect("/studio/spaces");
  return emailAuthEnabled() ? <EmailLoginForm/> : <LoginForm/>;
}
