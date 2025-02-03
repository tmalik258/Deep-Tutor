"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import motion
import Image from "next/image";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2,
      }}
      className="fixed top-5 left-5 right-5 inset-x-0 bg-white rounded-lg shadow-xl z-50"
    >
      <div className="mx-auto px-6 md:px-12 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/logo.svg"} height={30} width={130} alt={"logo"} />
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600"
                >
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignUpButton>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600"
                >
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button className="bg-gray-900 text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </SignInButton>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};


// Add these at the bottom of your file
const SignInButton = ({ children }: { children: React.ReactNode }) => (
  <Link href="/sign-in">{children}</Link>
);

const SignUpButton = ({ children }: { children: React.ReactNode }) => (
  <Link href="/sign-up">{children}</Link>
);

export default Navbar;
