'use client'
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useAuthContext } from "@/components/AuthContext";
import { useRouter } from 'next/navigation';

export enum Page {
    Cards = 'cards',
    Team = 'team'
}

export enum CardsPageOperations {
    ChangePin = 'change-pin',
    AddCard = 'add-card*UNAVAILABLE*',
    ChangePolicyForCard = 'change-policy-for-card*UNAVAILABLE*'
}

export enum TeamPageOperations {
    InviteMember = 'invite-member',
    RemoveMember = 'remove-member',
    EditMember = 'edit-member',
}

export const AVAILABLE_OPERATIONS_PER_PAGE = {
    [Page.Cards]: Object.values(CardsPageOperations),
    [Page.Team]: Object.values(TeamPageOperations)
}

// A component dedicated to adding readables/actions that are global to the app.
const CopilotContext = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuthContext()
    const router = useRouter();

    useCopilotReadable({
        description: 'The current user logged into the system',
        value: currentUser,
    })

    useCopilotReadable({
        description: 'The available pages and operations',
        value: {
            pages: Page,
            operations: AVAILABLE_OPERATIONS_PER_PAGE,
        }
    })

    useCopilotAction({
        name: 'navigateToPageAndPerform',
        description: `
            Navigate to a page to perform an operation.
            
            If the operation name you resolved contains "*UNAVAILABLE*". Tell the user to navigate themselves to the page.
            Let them know which page that is.
            Advise them to re-ask co-pilot once they arrive at the right page.
            You can suggest making the navigation part yourself
            Example: "Adding new card is not available in this page. Navigate to "Cards" page and try to ask me again there. Would you like me to take you there?"
            
            Otherwise, initiate the navigation without asking
        `,
        parameters: [
            {
                name: 'page',
                type: 'string',
                description: 'The page in which to perform the operation',
                required: true,
            },
            {
                name: 'operation',
                type: 'string',
                description: 'The operation to perform. Use operation code from available operations per page. If the operation is unavailable, do not pass it',
                required: false,
            },
            {
                name: 'operationAvailable',
                type: 'boolean',
                description: 'Flag if the operation is available',
                required: true,
            },
        ],
        handler: ({ page, operation, operationAvailable }) => {
            const operationParams = `?operation=${operation}`
            router.push(`/${page.toLowerCase()}${operationAvailable ? operationParams : ''}`);
        }
    })

  return children;
};

export default CopilotContext;
