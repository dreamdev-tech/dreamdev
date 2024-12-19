import CallToAction from "@/components/home/call-to-action";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";

export default function HomePage() {
    return (
        <main className="flex-grow">
            <Hero />
            <Features />
            <CallToAction />
        </main>
    );
}
