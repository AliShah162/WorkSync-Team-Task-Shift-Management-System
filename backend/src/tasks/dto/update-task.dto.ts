import { IsDateString, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString() @IsOptional()
  title?: string;

  @IsString() @IsOptional()
  description?: string;

  @IsIn(['TODO', 'IN_PROGRESS', 'COMPLETED']) @IsOptional()
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

  @IsInt() @IsOptional()
  assignedUserId?: number;

  @IsDateString() @IsOptional()
  dueDate?: string;
}