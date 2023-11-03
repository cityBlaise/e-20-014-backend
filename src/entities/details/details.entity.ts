import { TechnicalInfo } from "@Entities/technical_info/technical_info.entity";
import { BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
 @Entity()
export class Details {
    @PrimaryGeneratedColumn('uuid')
    details_id:string;

    @Column()
    createdAt: Date;
    
    @BeforeInsert()
    setDate() {
        this.createdAt = new Date()
    }
    
    @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column({default:false})
    microphone:boolean;
    
    @Column({default:false})
    waterResistant:boolean;
     
    @Column({nullable:true,precision:2,})
    weight:number;
     
    @Column({type:'int',default:0})
    batterieLife:number;

    @OneToOne(() => TechnicalInfo,(technical_info)=>technical_info.details)
    technical_info:TechnicalInfo;

}
