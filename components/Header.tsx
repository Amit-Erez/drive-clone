"use client"

import Image from "next/image";
import React from "react";
import Search from "./Search"
import FileUploader from "./FileUploader";
import { logoutRequest } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Header = ({ userId, accountId}: {userId: string; accountId: string}) => {
  const router = useRouter();

  const onLogout = async () => {
      await logoutRequest()
      router.replace("/sign-in");
      router.refresh(); 
    };
  

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId}/>
          <button type="submit" className="sign-out-button" onClick={onLogout}>
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </button>
      </div>
    </header>
  );
};

export default Header;
