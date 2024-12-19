import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="bg-background py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                        Learn Development the Right Way
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Master the art of coding with our comprehensive courses,
                        hands-on tutorials, and expert-led workshops.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <Button size="lg" className="w-full sm:w-auto">
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
