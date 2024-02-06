"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gameTypes as gameTypesSchema } from "@/server/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  opponent: z.string().min(1, { message: "You must have an opponent" }),
  gameType: z.string(),
  questionCount: z
    .number()
    .min(1, { message: "Games must have between 1 and 10 questions" })
    .max(10, { message: "Games must have between 1 and 10 questions" }),
});

export function NewGameForm({
  gameTypes,
}: {
  gameTypes: (typeof gameTypesSchema.$inferSelect)[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      opponent: "",
      gameType: "0",
      questionCount: 5,
    },
  });

  const gameTypeDesc = useMemo(() => {
    const gameTypeId = parseInt(form.getValues().gameType);
    const gt = gameTypes.find((g) => g.id === gameTypeId);
    if (!gt) return "";
    return gt.description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, form.getValues(), gameTypes]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // TODO
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContent className="pb-0 mb-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A game to learn"
                    className="max-w-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A unique name so you can identify this game
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opponent"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Opponent</FormLabel>
                <FormControl>
                  <Input
                    placeholder="arthas_menethil32"
                    className="max-w-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The username of the player you would like to play against
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gameType"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Game Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gameTypes.map((gameType) => (
                      <SelectItem
                        key={gameType.id}
                        value={gameType.id.toString()}
                      >
                        {gameType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{gameTypeDesc}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="questionCount"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Question Count</FormLabel>
                <FormControl>
                  <Input type="number" className="max-w-[100px]" {...field} />
                </FormControl>
                <FormDescription>
                  The number of questions for this game
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </form>
    </Form>
  );
}
