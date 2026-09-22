import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'csv-parse/sync';

import { ContactsService } from './contacts.service';

type UploadedCsvFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

type CsvRecord = {
  Name?: string;
  name?: string;
  Phone?: string;
  phone?: string;
  Email?: string;
  email?: string;
  Organization?: string;
  organization?: string;
  AcademicYear?: string;
  academicYear?: string;
  Semester?: string;
  semester?: string;
};

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Post()
  create(@Body() contactData: any) {
    return this.contactsService.create(contactData);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: UploadedCsvFile) {
    if (!file) {
      return {
        message: 'No file uploaded',
      };
    }

    const csvText = file.buffer.toString('utf-8');

    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRecord[];

    const contacts = [];

    for (const record of records) {
      const contact = await this.contactsService.create({
        name: record.Name || record.name || '',
        phone: record.Phone || record.phone || '',
        email: record.Email || record.email || '',
        organization:
            record.Organization || record.organization || '',
        academicYear:
            record.AcademicYear || record.academicYear || '',
        semester: record.Semester || record.semester || '', 
        dataStatus: 'current',
      });

      contacts.push(contact);
    }

    return {
      message: 'CSV uploaded successfully',
      count: contacts.length,
      contacts,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() contactData: any,
  ) {
    return this.contactsService.update(Number(id), contactData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contactsService.delete(Number(id));
  }
}