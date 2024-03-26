import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GeneralInfos } from "@Entities/general_infos/general_infos.entity";
import { Details } from "@Entities/details/details.entity";
import { Product } from "@Entities/product/product.entity";

@Entity()
export class TechnicalInfo {
    @PrimaryGeneratedColumn('uuid')
    fiche_technique_id:string;

    @Column({nullable:false,default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    // @BeforeInsert()
    // setDate() { 
    //     this.createdAt = new Date()
    // }

    @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToOne(() => GeneralInfos,(generalInfo)=>generalInfo.technical_info,{
        cascade:true, 
        onDelete:'CASCADE',
        eager:true
    })
    @JoinColumn({name:"general_infos_id"})
    generalInfo:GeneralInfos;

    @OneToOne(() => Details,(details)=>details.technical_info,{
        cascade:true, 
        onDelete:'CASCADE',
        eager:true
    })
    @JoinColumn({name:'details_id'}) 
    details:Details
 
    @OneToOne(() => Product,(product)=>product.ficheTechnique) 
    product:Product;
}
