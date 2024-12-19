import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/theme/mode-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function Navbar() {
    return (
        <nav className="bg-background border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center"
                        >
                            <span className="text-2xl font-bold text-primary">
                                Dreamdev
                            </span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/courses"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground"
                            >
                                Courses
                            </Link>
                            <Link
                                to="/tutorials"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground"
                            >
                                Tutorials
                            </Link>
                            <Link
                                to="/blog"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground"
                            >
                                Blog
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <ModeToggle />
                        <Button variant="outline" className="ml-2 mr-2"  asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/signup">Sign up</Link>
                        </Button>
                    </div>

                    <div className="flex items-center sm:hidden">
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" className="ml-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16m-7 6h7"
                                        />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="pt-2 pb-3 space-y-1"
                            >
                                <DropdownMenuItem>
                                    <Link
                                        to="/courses"
                                        className="block px-3 py-2 text-base font-medium text-foreground"
                                    >
                                        Courses
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        to="/tutorials"
                                        className="block px-3 py-2 text-base font-medium text-foreground"
                                    >
                                        Tutorials
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        to="/blog"
                                        className="block px-3 py-2 text-base font-medium text-foreground"
                                    >
                                        Blog
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="pt-4 pb-3 border-t border-muted">
                                        <div className="flex items-center px-4">
                                            <Button
                                                variant="outline"
                                                className="mr-2 w-full"
                                            >
                                                <Link to={"/login"}>
                                                    Log in
                                                </Link>
                                            </Button>
                                            <Button className="w-full">
                                                <Link to={"/signup"}>
                                                    Sign up
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
