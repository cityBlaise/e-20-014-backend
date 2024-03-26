import { Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable, BeforeInsert, OneToMany, BeforeUpdate, IsNull } from "typeorm";
import { TechnicalInfo } from "@Entities/technical_info/technical_info.entity";
import { Image } from "@Entities/image/image.entity"; 
import { Categorie } from "@Entities/categorie/categorie.entity";
import { ProductVariant } from "@Entities/product/productVariant.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    product_id: string;

    @Column({ nullable: true ,type:"longtext"})
    description: string

    @Column({unique:true})
    name: string;

    @Column({type:"simple-array",nullable:true}) 
    colors: string[];

    @Column({ precision: 3, default: 0 })
    price: number;

    @Column({ default: 0 })
    amount: number;

    @Column({ nullable: true })
    rating: number;

    @Column({default: () => "CURRENT_TIMESTAMP",nullable:false})
    createdAt: Date;

     

    @BeforeUpdate()
    update() {
        this.updatedAt = new Date()
    }

    @UpdateDateColumn({ precision: null,nullable:false, type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToMany(() => Image, {
        cascade: ['insert'],
        eager:true
    })
    @JoinTable({ name: 'product_image' })
    images: Image[]

    @OneToMany(() => ProductVariant, (variant) => variant.parent)
    variants: ProductVariant[]

    @OneToOne(type => TechnicalInfo, ficheTech => ficheTech.product, {
        cascade:true,
        onDelete:'CASCADE',
        eager:true
    })
    @JoinColumn({name:"fiche_technique_id"}) 
    ficheTechnique: TechnicalInfo|null;

    @ManyToMany(() => Categorie, (category) => category.products, {
        cascade: ['insert'],
        eager:true
    })
    @JoinTable({
        name: 'product_categorie',
        joinColumn: {
            name: "product_id" ,
        },
        inverseJoinColumn: { name: 'categorie_id'} 
    })
    categories: Categorie[]

}
