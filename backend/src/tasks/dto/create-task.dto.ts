import { IsDateString, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString() @MinLength(2)
  title: string;

  @IsString() @IsOptional()
  description?: string;

  @IsInt()
  projectId: number;

  @IsInt() @IsOptional()
  assignedUserId?: number;

  @IsDateString() @IsOptional()
  dueDate?: string;
}