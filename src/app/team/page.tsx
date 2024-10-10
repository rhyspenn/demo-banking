'use client'
import useTeam from "@/app/team/actions";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/components/AuthContext";
import { ExpenseRole, MemberRole } from "@/app/api/v1/data";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useReducer } from "react";
import { TeamPageOperations } from "@/components/CopilotContext";
import { useSearchParams } from "next/navigation";

interface DialogState {
    email: string;
    role: MemberRole;
    team: ExpenseRole;
    loading: boolean;
    dialogOpen: boolean;
    memberId: string | null,
}

const defaultDialogState = {
    email: '',
    role: MemberRole.Member,
    team: ExpenseRole.Marketing,
    loading: false,
    dialogOpen: false,
    memberId: null,
}

function InviteMemberDialog({
    onStateChange,
    onSubmit,
    ...dialogState
}: DialogState & { onStateChange: (payload: Partial<DialogState>) => void, onSubmit: () => void }) {
    return (
        <Dialog open={dialogState.dialogOpen && !dialogState.memberId}
                onOpenChange={open => onStateChange(open ? { dialogOpen: open } : defaultDialogState)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Enter the email, role, and team for the new member.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={dialogState.email}
                            onChange={(e) => onStateChange({ email: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Select onValueChange={(value) => onStateChange({ role: value as MemberRole })}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={MemberRole.Admin}>Admin</SelectItem>
                                    <SelectItem value={MemberRole.Member}>Member</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team" className="text-right">
                            Team
                        </Label>
                        <Select onValueChange={(value) => onStateChange({ team: value as ExpenseRole })}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={ExpenseRole.Marketing}>Marketing</SelectItem>
                                    <SelectItem value={ExpenseRole.Engineering}>Engineering</SelectItem>
                                    <SelectItem value={ExpenseRole.Executive}>Executive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={() => onSubmit()}
                    >
                        {dialogState.loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : 'Invite Member'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditMemberDialog({
    onStateChange,
    onSubmit,
    ...dialogState
}: DialogState & { onStateChange: (payload: Partial<DialogState>) => void, onSubmit: () => void }) {
    return (
        <Dialog open={dialogState.dialogOpen && !!dialogState.memberId}
                onOpenChange={open => onStateChange(open ? { dialogOpen: open } : defaultDialogState)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Member</DialogTitle>
                    <DialogDescription>
                        Edit the team or role of a member
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Select onValueChange={(value) => onStateChange({ role: value as MemberRole })}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={MemberRole.Admin}>Admin</SelectItem>
                                    <SelectItem value={MemberRole.Member}>Member</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team" className="text-right">
                            Team
                        </Label>
                        <Select onValueChange={(value) => onStateChange({ team: value as ExpenseRole })}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={ExpenseRole.Marketing}>Marketing</SelectItem>
                                    <SelectItem value={ExpenseRole.Engineering}>Engineering</SelectItem>
                                    <SelectItem value={ExpenseRole.Executive}>Executive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={() => onSubmit()}
                    >
                        {dialogState.loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : 'Invite Member'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Team() {
    const { currentUser } = useAuthContext()
    const { team, inviteMember, removeMember } = useTeam()
    const searchParams = useSearchParams();
    const operation = searchParams.get('operation') as TeamPageOperations | null

    const [dialogState, dispatchDialogState] = useReducer<React.Reducer<DialogState, Partial<DialogState>>>(
        (state: DialogState, payload: Partial<DialogState>) => ({ ...state, ...payload }),
        defaultDialogState
    )

    const handleAddMemberSubmit = () => {
        dispatchDialogState({ loading: true })
        void inviteMember(dialogState.email, dialogState.role, dialogState.team)
        dispatchDialogState({ dialogOpen: false, loading: false })
    }

    const operationNameToMethod: Partial<Record<TeamPageOperations, () => void>> = {
        [TeamPageOperations.InviteMember]: () => dispatchDialogState({ dialogOpen: true }),
    }

    useEffect(() => {
        if (!operation || !Object.values(TeamPageOperations).includes(operation)) return;
        operationNameToMethod[operation]?.()
    }, [operation]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
                <Button onClick={() => dispatchDialogState({ dialogOpen: true })}>
                    <UserPlus className="mr-2 h-4 w-4" /> Invite Team Member
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                    <Card key={member.id}>
                        <CardHeader>
                            <CardTitle>{member.name}</CardTitle>
                            <CardDescription>{member.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Role:</span>
                                    <span className="font-semibold">{member.role}</span>
                                </div>
                            </div>
                        </CardContent>
                        {currentUser.role === MemberRole.Admin ? (
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={() => dispatchDialogState({ memberId: member.id, dialogOpen: true })}>Edit</Button>
                                <Button variant="destructive" onClick={() => removeMember(member.id)}>Remove</Button>
                            </CardFooter>
                        ) : null}
                    </Card>
                ))}
            </div>
            <InviteMemberDialog {...dialogState} onStateChange={dispatchDialogState} onSubmit={handleAddMemberSubmit} />
            <EditMemberDialog {...dialogState} onStateChange={dispatchDialogState} onSubmit={handleAddMemberSubmit} />
        </div>
    )
}
