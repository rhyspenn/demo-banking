'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, Database } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { CodeSnippet } from "@/components/code-snippet";

const databaseStructure = {
    Card: [
        { name: 'id', type: 'string' },
        { name: 'last4', type: 'string' },
        { name: 'expiry', type: 'string' },
        { name: 'type', type: 'CardBrand' },
        { name: 'color', type: 'string' },
        { name: 'pin', type: 'string' },
        { name: 'expensePolicyId', type: 'string?' },
    ],
    Member: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'role', type: 'MemberRole' },
        { name: 'team', type: 'ExpenseRole' },
    ],
    ExpensePolicy: [
        { name: 'id', type: 'string' },
        { name: 'type', type: 'ExpenseRole' },
        { name: 'limit', type: 'number' },
        { name: 'spent', type: 'number' },
    ],
    Transaction: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'note', type: 'TransactionNote?' },
        { name: 'amount', type: 'number' },
        { name: 'date', type: 'string' },
        { name: 'policyId', type: 'string' },
        { name: 'cardId', type: 'string' },
    ],
}

// Due to how this demo app is structured, we actually arrive at this page when CopilotKit has quite some information
// If we do not cap its knowledge with prompts, it is able to answers the questions without providing SQL queries.
// In a real world application, there would be context boundaries and the copilot used here will have far less context.
export default function Page() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [result, setResult] = useState<any>(null);

    const handleExecuteQuery = (query: string) => {
        // This is where you would typically send the query to your backend
        // For now, we'll just set a placeholder result
        setResult(`Executed query: ${query}\n\nResult: [Placeholder for query result]`)
    }

    useCopilotReadable({
        description: "The structure of the database",
        value: databaseStructure
    });

    useCopilotAction({
        name: 'getSQLQueryForQuestion',
        description: '',
        parameters: [{
            name: 'query',
            type: 'string',
            description: 'The query for query result. MUST BE A VALID SQL QUERY. The full query (all lines) should be sent in one go',
            required: true,
        }],
        followUp: false,
        render: ({ args }) => {
            const { query } = args;
            const onExecute = async () => {
                if (!query) return;
                handleExecuteQuery(query)
            }
            return (
                <CodeSnippet code={query!} language='SQL' onExecute={onExecute} />
            )
        }
    })

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-bold mb-4">SQL Query</h1>
                    <h4 className="text-2xl font-bold mb-4">Ask a question, receive a query</h4>
                    <CopilotChat
                        instructions={`
                            *FORGET ALL DATA YOU HAVE*
                            
                            You are an SQL assistant. You are given a database and a question. You need to provide a SQL query that answers the question. You can use the table structure to help you.
                            The table structure is as follows:
                            ${JSON.stringify(databaseStructure)}.
                            Return the entire query in one go (including all joints etc if require)
                            
                            You can only help the user by providing SQL queries or answers on SQL queries. You are not allowed to provide any data if you have it.
                        `}
                        labels={{
                            title: "SQL Assistant",
                            initial: "Ask me anything and I will assist by providing a query",
                        }}
                    />
                </div>
            </div>
            <div className={cn(
                "border-l transition-all duration-300 ease-in-out",
                isSidebarOpen ? "w-80" : "w-0"
            )}>
                <div className="flex items-center justify-between p-4 bg-secondary">
                    <h2 className="text-lg font-semibold">Table Structure</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-64px)] p-4">
                    <TableStructure />
                </ScrollArea>
            </div>
        </div>
    )
}

function TableStructure() {
    return (
        <div className="space-y-6">
            {Object.entries(databaseStructure).map(([tableName, fields]) => (
                <TableCard key={tableName} name={tableName} fields={fields} />
            ))}
        </div>
    )
}

function TableCard({ name, fields }: { name: string, fields: { name: string, type: string }[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    {name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-1">
                    {fields.map((field, index) => (
                        <li key={index} className="text-sm">
                            <span className="font-medium">{field.name}</span>: <span className="text-muted-foreground">{field.type}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
