import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpen, Code, Users } from "lucide-react";

export default function Features() {
    return (
        <section className="py-20 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                        Why Choose Dream dev?
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
                        Our platform offers a unique blend of features designed
                        to accelerate your learning and boost your development
                        skills.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Code className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>
                                    Interactive Coding Exercises
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Practice your skills with our interactive
                                    coding challenges and get instant feedback.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BookOpen className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>
                                    Comprehensive Curriculum
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    From beginner to advanced, our courses cover
                                    a wide range of development topics and
                                    technologies.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Users className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Expert Instructors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Learn from industry professionals with years
                                    of experience in software development.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
