import { Product } from "@Entities/product/product.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    image_id: string;

    @Column({default:''})
    path: string; 

    @Column({ length: 40 ,nullable:true})
    blurhash: string;

    @Column({nullable:false,default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    // @BeforeInsert()
    // setDate(){
    //     this.createdAt = new Date()
    // }

    @ManyToMany(()=>Product,)
    @JoinTable({ name: 'product_image' })
    products:Product[]

    @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

}
