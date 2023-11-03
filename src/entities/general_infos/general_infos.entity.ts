import { TechnicalInfo } from "@Entities/technical_info/technical_info.entity";
import { BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class GeneralInfos {
    @PrimaryGeneratedColumn('uuid')
    general_infos_id:string;

    @Column()
    createdAt: Date;
    
    
    @BeforeInsert()
    setDate() {
        this.createdAt = new Date()
    }
    
    @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
    
    @Column({nullable:true})
    releaseDate: Date;

    @Column({nullable:true})
    brand:string;

    @Column({nullable:true})
    model:string;
 
    @Column({nullable:true})
    connectivity:string;

    @OneToOne(() => TechnicalInfo,(technical_info)=>technical_info.generalInfo)
    technical_info:TechnicalInfo;
}
