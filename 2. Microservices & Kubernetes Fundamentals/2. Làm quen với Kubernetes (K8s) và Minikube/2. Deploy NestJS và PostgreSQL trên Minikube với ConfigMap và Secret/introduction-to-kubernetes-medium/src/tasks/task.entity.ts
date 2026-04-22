import { Column , CreateDateColumn , Entity , PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' , length: 255})
    title: string;

    @Column({type: 'boolean' , default: false})
    completed: boolean;

    @CreateDateColumn()
    createdAt: Date;
}


