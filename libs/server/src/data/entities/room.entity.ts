import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// NOTE: Part of the rationale for this is that it should mostly be information that can't be recreated from the logs
@Entity('rooms')
export class RoomEntity {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        uid: string;

    @Column()
        createdAt: number;

    @Column({nullable:true})
        closedAt: number;

    @Column()
        host: string;

    @Column('simple-array', {array: true})
        clients: string[];
        // Any clients (including local) who have been in the room, not just current

    @Column('simple-array', {array: true})
        currentClients: string[];
        // Current clients (including local) in room

    @Column()
        code: string;

    @Column()
        closed: boolean;

    // Room Options
    @Column({nullable:true})
        name: string;

    @Column()
        size: number;

    @Column({nullable:true})
        password: string;
}
