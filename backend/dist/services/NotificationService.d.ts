export interface NotificationRow {
    id: number;
    user_id: number;
    type: string;
    title: string;
    body: string | null;
    is_read: number;
    created_at: string;
}
export declare class NotificationService {
    list(userId: number, onlyUnread?: boolean, limit?: number, offset?: number): Promise<NotificationRow[]>;
    countUnread(userId: number): Promise<number>;
    markAllRead(userId: number): Promise<void>;
    markRead(notificationId: number, userId: number): Promise<void>;
    deleteAll(userId: number): Promise<void>;
    create(userId: number, type: string, title: string, body?: string): Promise<void>;
    createForAllProfessors(type: string, title: string, body?: string): Promise<void>;
}
//# sourceMappingURL=NotificationService.d.ts.map