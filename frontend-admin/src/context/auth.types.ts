export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}