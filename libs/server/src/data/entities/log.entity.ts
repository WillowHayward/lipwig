import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('logs')
export class LogEntity {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        timestamp: number;

    @Column()
        level: string;

    @Column()
        type: string;

    @Column()
        uid: string;

    @Column()
        event: string;

    @Column()
        message: string;

    @Column({nullable:true})
        subevent?: string;

    @Column({nullable:true})
        room: string;

}
