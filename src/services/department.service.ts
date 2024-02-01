import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DepartmentRepository, OrganizationRepository} from '../repositories';
import {Department} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class DepartmentService {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
  ) { }

  async createDepartment(payload: {
    name: string;
    orgId: string;
  }): Promise<{statusCode: number; message: string; data?: Department}> {
    const organization = await this.organizationRepository.findOne({
      where: {
        id: payload.orgId,
        isDeleted: false,
      },
    });

    if (organization) {
      const data = await this.departmentRepository.create(payload);
      return {
        statusCode: 200,
        message: 'created successfully',
        data,
      };
    } else {
      return {
        statusCode: 400,
        message: 'Cannot find organization',
      };
    }
  }

  async countDepartments() {
    const data = await this.departmentRepository.find({
      where: {
        isDeleted: false,
      },
    });

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    const count = data.length;

    return {
      statusCode: 200,
      message: 'Success',
      count,
    };
  }

  async findDepartments() {
    const data = await this.departmentRepository.find({
      where: {
        isDeleted: false,
      },
    });

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  async findDepartmentById(id: string): Promise<Department | null> {
    return this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async updateDepartmentById(
    id: string,
    payload: {
      name?: string;
      orgId?: string;
    },
  ) {
    const existingData = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    const result = await this.departmentRepository.updateById(id, payload);

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }

  async deleteDepartmentById(id: string) {
    const existingData = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Departments data already deleted',
      };
    }

    const result = await this.departmentRepository.updateById(id, {
      isDeleted: true,
    });

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }
}