import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Req,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrganizationService } from './organization.service';
import { ParseObjectIdPipe } from '../../shared/pipe/parse-object-id.pipe';
import { ResOrganizationDto } from './dto/dto/response.organization.dto';
import { CreateOrganizationDto } from './dto/dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/dto/update-organization.dto';
import { Organization } from 'src/database/schemas/organization.schema';


@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Get(':id')
    getOrganizationById(
        @Param('id', ParseObjectIdPipe) id: string
    ): Observable<{ organization: ResOrganizationDto }> {
        return this.organizationService.findById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createOrganization(
        @Body() createOrganizationDto: CreateOrganizationDto
    ): Promise<Organization> {
        return this.organizationService.save(createOrganizationDto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateOrganization(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateOrganizationDto: UpdateOrganizationDto,
    ): Promise<{ organization: Organization }> {
        return this.organizationService.updateOrganization(id, updateOrganizationDto);
    }

    @Delete(':id')
    deleteOrganization(
        @Param('id', ParseObjectIdPipe) id: string
    ): Observable<Organization> {
        return this.organizationService.delete(id);
    }

    @Get()
    async findAll(): Promise<Organization[]> {
        return this.organizationService.findAll();
    }
}