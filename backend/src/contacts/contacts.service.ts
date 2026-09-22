import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contact } from './contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findAll() {
    return this.contactRepository.find();
  }

  async create(contactData: Partial<Contact>) {
    const contact = this.contactRepository.create(contactData);

    return this.contactRepository.save(contact);
  }

  async findOne(id: number) {
    return this.contactRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, contactData: Partial<Contact>) {
    await this.contactRepository.update(id, contactData);

    return this.findOne(id);
  }

  async delete(id: number) {
    await this.contactRepository.delete(id);

    return {
      message: 'Contact deleted successfully',
    };
  }
}