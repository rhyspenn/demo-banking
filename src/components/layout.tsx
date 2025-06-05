"use client";

import Link from "next/link";
import { CreditCard, LayoutDashboard, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Member, MemberRole } from "@/app/api/v1/data";
import { useAuthContext } from "@/components/auth-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCopilotChat, useCopilotReadable } from "@copilotkit/react-core";
import { usePathname } from "next/navigation";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

interface LayoutProps {
  children: React.ReactNode;
}

function UserNavigation({
  availableUsers,
  currentUser,
  onChangeUser,
}: {
  availableUsers: Member[];
  currentUser: Member;
  onChangeUser: (user: Member) => void;
}) {
  const getInitials = (name: string) => {
    return (name || "X Y")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-58" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Current User</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {currentUser.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentUser.email}
              </p>
            </div>
            <div className="grid gap-2">
              <h4 className="font-medium leading-none">Switch User</h4>
              {availableUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onChangeUser(user)}
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  {user.name} (
                  {user.role === MemberRole.Admin
                    ? user.role
                    : user.role == MemberRole.Assistant
                      ? user.team + " " + user.role
                      : user.team}
                  )
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function LayoutComponent({ children }: LayoutProps) {
  const { users, currentUser, setCurrentUser } = useAuthContext();
  const pathname = usePathname();
  console.log("pathname", pathname.split("/")[1]);
  useCopilotReadable({
    description: "The current page where the user is",
    value: pathname.split("/")[1] == "" ? "cards" : pathname.split("/")[1],
  });
  useCopilotChatSuggestions({
    instructions: `
      You have access to where the user is in the app from copilotkit readables.
        -if the user is on the cards page,
          suggest actions/information in this page related to credit cards, transactions or policies.
          Use specific items or "all items", for example:
          "Show all transactions of Marketing department" or "Tell me how much I spent on my Mastercard"
          If the user has permission to e.g. add credit card, then you can suggest to add a new card.
          Do the same for other actions.
        -if the user is on the dashboard page,
          suggest prompts like "describe current view" so that you can provide a summary of the current view.
          you can also suggest prompts like "show me the recent transactions", "list all policies" or "show me the team".
    `,
    minSuggestions: 3,
    maxSuggestions: 3,
    // className:
    //   currentUser.role === MemberRole.Admin
    //     ? "bg-purple-500 prefix-arrow text-xs p-1 rounded-sm text-white"
    //     : undefined,
  });

  const { setMessages, reloadMessages } = useCopilotChat();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-16 flex-col items-center space-y-8 border-r bg-gray-900 py-4">
        <Link href="/" className="flex items-center justify-center">
          <LayoutDashboard className="h-8 w-8 text-white" />
        </Link>
        <nav className="flex flex-1 flex-col items-center space-y-6">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/" icon={CreditCard} label="Credit Cards" />
          {currentUser.role === MemberRole.Admin ? (
            <>
              <NavItem href="/team" icon={Users} label="Team Management" />
            </>
          ) : null}
        </nav>
        <div className="flex flex-col items-center space-y-4">
          <ThemeToggle />
          <UserNavigation
            availableUsers={users}
            currentUser={currentUser}
            onChangeUser={setCurrentUser}
          />
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <h1 className="text-2xl font-bold">Hello, {currentUser.name}</h1>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function NavItem({ href, icon: Icon, label }: NavItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md text-gray-400 hover:bg-gray-800 hover:text-white",
              "transition-colors duration-200"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
