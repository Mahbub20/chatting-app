export interface User{
    id: string;
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isOnline: boolean;
    role: string;
    userChatHistoryEnabled: boolean;
}