import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <span className="text-2xl font-bold text-primary">
                            DevEdu
                        </span>
                        <p className="text-muted-foreground text-base">
                            Empowering developers through education and hands-on
                            learning.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                                    Platform
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link
                                            to="/courses"
                                            className="text-base text-muted-foreground hover:text-foreground"
                                        >
                                            Courses
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/tutorials"
                                            className="text-base text-muted-foreground hover:text-foreground"
                                        >
                                            Tutorials
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/blog"
                                            className="text-base text-muted-foreground hover:text-foreground"
                                        >
                                            Blog
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                                    Support
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link
                                            to="/faq"
                                            className="text-base text-muted-foreground hover:text-foreground"
                                        >
                                            FAQ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/contact"
                                            className="text-base text-muted-foreground hover:text-foreground"
                                        >
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-muted pt-8">
                    <p className="text-base text-muted-foreground xl:text-center">
                        &copy; {new Date().getFullYear()}{" "}
                        DevEdu. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
