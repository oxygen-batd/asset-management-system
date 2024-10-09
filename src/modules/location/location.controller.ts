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
import { LocationService } from './location.service';
import { ParseObjectIdPipe } from '../../shared/pipe/parse-object-id.pipe';
import { CreateLocationDto } from './dto/dto/create-location.dto';
import { UpdateLocationDto } from './dto/dto/update-location.dto';
import { ResLocationDto } from './dto/dto/response.location.dto';
import { Location } from 'src/database/schemas/location.schema';


@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get(':id')
    getLocationById(
        @Param('id', ParseObjectIdPipe) id: string
    ): Observable<{ location: ResLocationDto }> {
        return this.locationService.findById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createLocation(
        @Body() createLocationDto: CreateLocationDto
    ): Promise<Location> {
        return this.locationService.save(createLocationDto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateLocation(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateLocationDto: UpdateLocationDto,
    ): Promise<{ location: Location }> {
        return this.locationService.updateLocation(id, updateLocationDto);
    }

    @Delete(':id')
    deleteLocation(
        @Param('id', ParseObjectIdPipe) id: string
    ): Observable<Location> {
        return this.locationService.delete(id);
    }

    @Get()
    async findAll(): Promise<Location[]> {
        return this.locationService.findAll();
    }
}