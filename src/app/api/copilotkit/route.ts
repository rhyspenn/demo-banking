import {
    CopilotRuntime,
    OpenAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { OpenAI } from "openai";
import { NextRequest } from "next/server";
import { FEDEX_MSA } from "@/lib/fake-msa";
import { PERMISSIONS } from "../v1/permissions";

// 支持多种 OpenAI 兼容 API 配置
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1", // 自定义 API 地址
});

const llmAdapter = new OpenAIAdapter({
    openai,
    model: process.env.OPENAI_MODEL || "gpt-4o", // 自定义模型
});

const runtime = new CopilotRuntime({
    actions: ({ properties }) => {
        if (!PERMISSIONS.READ_MSA.includes(properties.userRole)) {
            return [];
        }
        return [
            {
                name: "queryVendorMSA",
                description:
                    "Query MSA documents for a specific vendor. Call this if the user has any question specific to a vendor.",
                parameters: [
                    {
                        name: "vendorName",
                    },
                ],
                handler() {
                    return FEDEX_MSA;
                },
            },
        ];
    },
});

export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter: llmAdapter,
        endpoint: "/api/copilotkit",
    });

    return handleRequest(req);
};
