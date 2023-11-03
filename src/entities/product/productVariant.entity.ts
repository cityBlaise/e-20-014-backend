import { Column, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import { Image } from "@Entities/image/image.entity";
import { Product } from "@Entities/product/product.entity";

@Entity()
export class ProductVariant { 

    @PrimaryGeneratedColumn('uuid')
    product_variant_id: string;
 
    @Column({ length: 10, nullable: true })
    color: string;

    @Column({ precision: 3, default: 0 })
    price: number;

    @Column({ default: 0 })
    amount: number;

    @Column({ nullable: true })
    rating: number;

    @Column()
    createdAt: Date;

    @BeforeInsert()
    setDate() { 
        this.createdAt = new Date()
    }

    @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.variants)
    @JoinColumn({name:'parentId'})
    parent: Product;

    @ManyToMany(() => Image, {
        cascade: ['insert'], 
    }) 
    @JoinTable({
        name: 'product_variant_image',
        joinColumn: {
            name: "product_variant_id" ,
        },
        inverseJoinColumn: { name: 'image_id'} 
    })
    images: Image[] 
}
