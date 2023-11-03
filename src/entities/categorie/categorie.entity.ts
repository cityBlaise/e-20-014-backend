import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from "@Entities/image/image.entity";
import { Product } from "@Entities/product/product.entity";

@Entity()
export class Categorie {
    @PrimaryGeneratedColumn('uuid')
    categorie_id:string;

    @Column({unique:true})
    name:string;

    @Column()
    createdAt: Date;

    @BeforeInsert()
    setDate() { 
        this.createdAt = new Date()
    }

    @ManyToOne(() => Image,{
        eager:true
    })
    @JoinColumn({name:'image_id'})
    image:Image; 

    @ManyToMany(() => Product, (product) => product.categories,{
        cascade: ['insert'],
    })
    products:Product[];

    @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}
