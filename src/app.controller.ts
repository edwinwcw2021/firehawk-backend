import { Controller, Get, BadRequestException, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AutomobileDto } from './automobile.dto';
import { AppService } from './app.service';

@ApiTags('Automobiles')
@Controller('api/automobiles')
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all car records' })
  @ApiResponse({ status: 201, description: 'Car records fetched', type: AutomobileDto })  
  async findAll() {
    return this.appService.findAll();    
  }

  @Post()
  @ApiOperation({ summary: 'Create a new car record' })
  @ApiResponse({ status: 201, description: 'Car created', type: AutomobileDto })  
  async create(@Body() data: AutomobileDto): Promise<AutomobileDto> {
    return this.appService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing car record' })
  @ApiResponse({ status: 200, description: 'Car updated', type: AutomobileDto })
  async update(@Param('id') id: string, @Body() data: Partial<AutomobileDto>) {
    if (!id) {
      throw new BadRequestException('ID query parameter is required');
    }
    await this.appService.update(id, data);
  }

  @Delete(':id') 
  @ApiOperation({ summary: 'Delete a car record' })
  @ApiResponse({ status: 200, description: 'Car deleted' })
  async remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID query parameter is required');
    }
    await this.appService.remove(id);
  }

}
