import {NextRequest} from "next/server";
import { Card, data, generateUniqueId } from "../data";

// Get all transactions
export const GET = async (req: NextRequest) => {
    return new Response(JSON.stringify(data.transactions), { status: 200 });
};
