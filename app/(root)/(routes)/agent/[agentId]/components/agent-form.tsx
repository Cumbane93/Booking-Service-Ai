"use client"

import axios from "axios";
import * as z from "zod";
import { AgentCategory, Agent } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";


const PREAMBLE = `You are a receptionist for a medical practice and are responsible for answering phone calls. 
Your tasks:
Greeting: Greet the caller in a friendly manner and introduce yourself as the receptionist for the medical practice.
Inquire about the caller's request: Ask the caller about their reason for calling.
Scheduling an appointment: If the caller would like to schedule an appointment, ask them for their desired dates and times.
Checking availability: Check the practice's calendar system to see if the desired appointments are available. Offer alternative appointments if necessary.
Appointment confirmation: Once an appointment has been scheduled, confirm it again with the caller and enter it into the calendar.
Additional information: If necessary, ask the caller for any additional information that may be relevant to the appointment.
Farewell: Say goodbye to the caller in a friendly manner and wish them a good day.
Additional notes: Always be friendly and professional when dealing with callers. Ensure clear and understandable communication. Respond patiently to callers' questions and requests. Treat all callers with respect. Always adhere to the practice's data protection regulations.
`;

const SEED = `AI Agent Receptionist: Good morning, [Practice name] medical practice. This is [KI Name] speaking. How can I help you today?
Caller: Hi, I'd like to schedule an appointment with Dr. Jones for a checkup.
AI Agent Receptionist: Okay, how about [date] at [time]? Dr. Jones has a slot available then.
Caller: [Date] works for me, but can it be a bit later in the afternoon?
AI Agent Receptionist: Let me check... Yes, we have an opening at [alternative time] on [date].
Caller: Perfect, that works great. Thanks!
AI Agent Receptionist: Great! To confirm, this is for a checkup with Dr. Jones on [date] at [alternative time].
`;

interface AgentFormProps {
    initialData: Agent | null;
    agentCategories: AgentCategory[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    instructions: z.string().min(200, {
        message: "Instructions require at lest 200 characters.",
    }),
    seed: z.string().min(200, {
        message: "Seed require at lest 200 characters.",
    }),
    src: z.string().min(1, {
        message: "Image is required.",
    }),
    agentCategoryId: z.string().min(1, {
        message: "Agent Category is required.",
    }),
})
export const AgentForm = ({
    agentCategories,
    initialData
}: AgentFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            agentCategoryId: undefined,
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                // Update Agent functionality
                await axios.patch(`/api/agent/${initialData.id}`, values);
            } else {
                // Create Agent functionality
                await axios.post("/api/agent", values);
            }

            toast({
                description: "Success!"
            });

            router.refresh();
            router.push("/");

        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong",
            });
        }
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General Information about AI Agent
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField name="src"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4">
                                <FormControl>
                                    <ImageUpload
                                        disabled={isLoading}
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Agent Name"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is how your Agent will be named
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Inbound Booking Agent"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Short Description for your AI Agent
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="agentCategoryId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agent Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {agentCategories.map((agentCategory) => (
                                                <SelectItem
                                                    key={agentCategory.id}
                                                    value={agentCategory.id}
                                                >
                                                    {agentCategory.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a category for your AI Agent
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed instructions for AI Behavior
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="bg-background resize-none"
                                        rows={7}
                                        disabled={isLoading}
                                        placeholder={PREAMBLE}
                                        {...field} />
                                </FormControl>
                                <FormDescription>
                                    Describe in detail your agent&apos;s backstory and relevant details
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="seed"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Example Conversation</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="bg-background resize-none"
                                        rows={7}
                                        disabled={isLoading}
                                        placeholder={SEED}
                                        {...field} />
                                </FormControl>
                                <FormDescription>
                                    Give your agent an example for a conversation with the clients
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit your Agent" : "Create your Agent"}
                            <Wand2 className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
};