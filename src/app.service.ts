import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
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
  async create(data: Partial<AutomobileDto>): Promise<AutomobileDto> {
    this.logger.info({ carName: data.name }, 'Creating a new automobile record');
    const db = this.firebaseService.getDb();
    if (!db) throw new InternalServerErrorException('Firestore DB not initialized');

    // .doc() without arguments creates a new unique ID automatically
    const docRef = db.collection(this.collectionName).doc();
    data.dt_edt = new Date().toISOString(); // Add timestamp for record creation
    await docRef.set(data);
    
    return { id: docRef.id, ...data } as AutomobileDto;
  }

  // READ ALL
  async findAll() {
    this.logger.info('Fetching all automobiles');
    const snapshot = await this.firebaseService.getDb().collection(this.collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string) {
    this.logger.info({ id }, 'Fetching automobile record');
    const doc = await this.firebaseService.getDb().collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      this.logger.warn({ id }, 'Fetch failed: Record not found');
      throw new NotFoundException(`Automobile with ID ${id} not found`);
    }
    return { id: doc.id, ...doc.data() };
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
    if (doc.data()?.dt_edt!=data.dt_edt)  {
      throw new ConflictException('Record has been modified by another process. Please refresh and try again.');
    }

    data.dt_edt = new Date().toISOString(); // Add timestamp for record creation
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

  async test(): Promise<void> {
    throw new BadRequestException('This is a test error');
  }
}
