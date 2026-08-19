import { tavily } from "@tavily/core";
import OpenAI from "openai";

export const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
