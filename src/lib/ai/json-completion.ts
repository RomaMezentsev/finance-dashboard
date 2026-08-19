import { openai } from "@/lib/ai/clients";
import { withAbortTimeout } from "@/lib/api/with-abort-timeout";

type JsonCompletionOptions = {
  system: string;
  user: string;
  model?: string;
};

export async function createJsonCompletion<T>({
  system,
  user,
  model = "gpt-4o-mini",
}: JsonCompletionOptions): Promise<T> {
  const completion = await withAbortTimeout((signal) =>
    openai.chat.completions.create(
      {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      },
      { signal },
    ),
  );

  return JSON.parse(completion.choices[0].message.content || "{}") as T;
}
