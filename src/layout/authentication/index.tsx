"use client";

import Button from "@/components/local-ui/Button";
import IconButton from "@/components/local-ui/IconButton";
import { authState } from "@/store/atom/auth";
import { Eye, EyeOff } from "lucide-react";
import { PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";
import { useRecoilState } from "recoil";
import crypto from "crypto";
import { decryptMessage, encryptMessage } from "@/lib/bcrypt";
import Navbar from "../navbar";

export default function Authentication({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(authState);
  const [newUser, setNewUser] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [value, setValue] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      document.addEventListener("keypress", checkPassword);
      return () => {
        document.removeEventListener("keypress", checkPassword);
      };
    }
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    const security = localStorage.getItem("security");
    const securityDeadline = localStorage.getItem("security-deadline");
    if (!security) {
      setNewUser(true);
    } else if (securityDeadline) {
      const now = new Date().getTime();
      const deadline = decryptMessage(JSON.parse(securityDeadline));
      if (now < (parseInt(deadline) || 0)) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const generateSecureHash = (str: string) => {
    const hash = crypto
      .createHash("sha256")
      .update(`${process.env.NEXT_PUBLIC_SECRET}-${str}`)
      .digest()
      .toString("hex");
    return hash;
  };

  const successfullyAuthHandler = () => {
    setIsAuthenticated(true);
    const now = new Date().getTime() + 60 * 60 * 1000;
    const securityDeadline = encryptMessage(now.toString());
    localStorage.setItem("security-deadline", JSON.stringify(securityDeadline));
  };

  const createUserHandler = () => {
    const token = generateSecureHash(value.password);
    localStorage.setItem("security", token);
    successfullyAuthHandler();
  };

  const checkPassword = () => {
    const targetHash = localStorage.getItem("security");
    const currentHah = generateSecureHash(value.password);
    if (targetHash === currentHah) {
      successfullyAuthHandler();
    }
  };

  const changeHandler = (
    key: "password" | "confirmPassword",
    currentValue: string
  ) => {
    setValue((prev) => ({
      ...prev,
      [key]: currentValue,
    }));
  };

  const confirmHandler = () => {
    if (newUser) {
      createUserHandler();
    } else {
      checkPassword();
    }
  };

  function enterHandler(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key == "enter") {
      confirmHandler();
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      document.addEventListener("keypress", enterHandler);
      return () => {
        document.removeEventListener("keypress", enterHandler);
      };
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <div className="h-screen flex  justify-center items-center">
      <div className=" w-[90%] md:w-[50%] lg:w-[30%]">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 ">
          Welcome to Trackpack
        </h1>
        <p className="text-center text-foreground-secondary  mb-10 font-semibold">
          Let&apos;s get started.
        </p>
        <div className="flex items-center justify-between mb-4 px-4 py-2 bg-background-secondary rounded-lg">
          <input
            value={value.password}
            onChange={(e) => changeHandler("password", e.target.value)}
            type={passwordVisibility.password ? "text" : "password"}
            placeholder="Password"
            className="border-0 bg-transparent rounded-lg focus:outline-0  w-full"
          />
          <IconButton
            onClick={() =>
              setPasswordVisibility((prev) => ({
                ...prev,
                password: !prev.password,
              }))
            }
          >
            {passwordVisibility.password ? (
              <EyeOff width={24} />
            ) : (
              <Eye width={24} />
            )}
          </IconButton>
        </div>
        {newUser && (
          <div
            className={`flex items-center justify-between px-4 py-2 bg-background-secondary rounded-lg`}
          >
            <input
              value={value.confirmPassword}
              onChange={(e) => changeHandler("confirmPassword", e.target.value)}
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`border-0 bg-transparent rounded-lg focus:outline-0 w-full`}
            />
            <IconButton
              onClick={() =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
              }
            >
              {passwordVisibility.confirmPassword ? (
                <EyeOff width={24} />
              ) : (
                <Eye width={24} />
              )}
            </IconButton>
          </div>
        )}

        <Button
          disabled={
            newUser
              ? !value.confirmPassword.trim() ||
                value.confirmPassword !== value.password
              : !value.password.trim()
          }
          fullWidth
          className="mt-4"
          onClick={confirmHandler}
        >
          {newUser ? "Confirm" : "Unlock"}
        </Button>
      </div>
    </div>
  );
}
