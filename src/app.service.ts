import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AutomobileDto } from './automobile.dto';

@Injectable()
export class AppService {
  private readonly collectionName = 'automobiles';
  
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

// CREATE
  async create(data: AutomobileDto): Promise<AutomobileDto> {
    this.logger.info({ carName: data.name }, 'Creating a new automobile record');
    const db = this.firebaseService.getDb();
    
    // .doc() without arguments creates a new unique ID automatically
    const docRef = db.collection(this.collectionName).doc();
    await docRef.set(data);
    
    return { 
        id: docRef.id, 
        ...data 
    };
  }

  // READ ALL
  async findAll() {
    this.logger.info('Fetching all automobiles');
    const snapshot = await this.firebaseService.getDb().collection(this.collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // UPDATE
  async update(id: string, data: Partial<AutomobileDto>): Promise<void> {
    this.logger.info({ id }, 'Updating automobile record');
    const docRef = this.firebaseService.getDb().collection(this.collectionName).doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) {
      this.logger.warn({ id }, 'Update failed: Record not found');
      throw new NotFoundException(`Automobile with ID ${id} not found`);
    }

    await docRef.update(data as any);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    this.logger.info({ id }, 'Deleting automobile record');
    const docRef = this.firebaseService.getDb().collection(this.collectionName).doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Automobile with ID ${id} not found`);
    }

    await docRef.delete();
  }  
}
