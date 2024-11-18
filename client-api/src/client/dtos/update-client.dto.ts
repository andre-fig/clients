import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty({
    description: 'The name of the client',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The salary of the client',
    example: 1000,
  })
  salary?: number;

  @ApiProperty({
    description: 'The company value of the client',
    example: 10000,
  })
  companyValue?: number;
}
