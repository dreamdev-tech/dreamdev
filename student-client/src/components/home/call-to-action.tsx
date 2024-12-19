import { Button } from "@/components/ui/button";

export default function CallToAction() {
    return (
        <section className="bg-background py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                        Ready to Start Your Coding Journey?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                        Join thousands of developers who have transformed their
                        careers with Dream dev
                    </p>
                    <div className="mt-8">
                        <Button size="lg">Enroll Now</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
