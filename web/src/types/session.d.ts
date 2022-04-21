export interface Session {
    id: string;
    date_created: Date;
    user_created: {
        id: string;
        first_name: string;
        email: string;
    };
    date_updated: null | Date;
    user_updated: null | {
        id: string;
        first_name: string;
        email: string;
    };
}

export type SessionSort = (keyof Session | `-${keyof Session}`);
