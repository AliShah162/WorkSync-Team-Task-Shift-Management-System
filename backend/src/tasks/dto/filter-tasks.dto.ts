import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterTasksDto {
  @IsIn(['TODO', 'IN_PROGRESS', 'COMPLETED']) @IsOptional()
  status?: string;

  @IsInt() @IsOptional() @Type(() => Number)
  projectId?: number;

  @IsInt() @IsOptional() @Type(() => Number)
  assignedUserId?: number;

  @IsString() @IsOptional()
  sortBy?: 'createdAt' | 'dueDate' | 'updatedAt';

  @IsIn(['ASC', 'DESC']) @IsOptional()
  order?: 'ASC' | 'DESC';

  @IsInt() @IsOptional() @Type(() => Number)
  page?: number;

  @IsInt() @IsOptional() @Type(() => Number)
  limit?: number;
}
