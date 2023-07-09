import { LipwigSummary, RoomSummary, SERVER_ADMIN_EVENT } from '@lipwig/model';
import { RoomService } from '../../room/service/room.service';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { AnonymousSocket, AdminSocket } from '../../socket';
import { LipwigLogger } from '../../logging/logger/lipwig.logger';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../../data/entities/room.entity';
import { Repository } from 'typeorm';

// TODO: Guards - AdminGuard to check they're admin sending the commands
@Injectable()
export class AdminService {
    private admin: AdminSocket[] = [];
    constructor(
        private roomService: RoomService,
        @InjectRepository(RoomEntity)
        private roomRepo: Repository<RoomEntity>,
        private logger: LipwigLogger,
    ) { }

    getAdmin(): AdminSocket[] {
        return this.admin;
    }

    administrate(user: AnonymousSocket) {
        const id = v4();
        const socket = user.socket;
        const admin = new AdminSocket(socket, id, this.logger);

        this.admin.push(admin);
        admin.send({
            event: SERVER_ADMIN_EVENT.ADMINISTRATING,
        });
    }

    async summary(): Promise<LipwigSummary> {
        const rooms = await this.roomRepo.find();
        const active = rooms.filter(room => !room.closed);

        const nameBreakdown: Record<string, {
            total: number;
            current: number;
        }> = {};

        const names = new Set<string>(rooms.map(room => room.name));
        for (const name of names) {
            const total = rooms.filter(room => room.name === name).length;
            const current = active.filter(room => room.name === name).length;
            nameBreakdown[name] = {
                total,
                current
            }
        }

        return {
            total: rooms.length,
            current: active.length,
            names: nameBreakdown
        }
    }

    private summarizeRoom(room: RoomEntity): RoomSummary {
        return {
            id: room.uid,
            name: room.name,
            active: !room.closed
        }
    }

    async rooms(): Promise<RoomSummary[]> {
        const rooms = await this.roomRepo.find();
        const summaries: RoomSummary[] = [];
        for (const room of rooms) {
            const summary = this.summarizeRoom(room);
            summaries.push(summary);
        }

        return summaries;
    }

    async room(id: string): Promise<RoomSummary> {
        const room = await this.roomRepo.findOneBy({ uid: id });
        if (!room) {
            throw new Error('Room Not Found'); // TODO: Handle this better
        }

        return this.summarizeRoom(room);
    }
}
