import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingPopup({ text }: { text: string }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-[200px]">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>{text}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
