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
        event: string;

    @Column({nullable:true})
        uid?: string;

    @Column({nullable:true})
        subevent?: string;

    @Column({nullable: true})
        data?: string;

    @Column({nullable:true})
        room?: string;

}
