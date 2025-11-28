import { createCachedRepository } from '@/utils';
import { TestModel, CreateTestDto, UpdateTestDto, GetAllTestsDto } from '@/features/test';

const repo = createCachedRepository(TestModel, 'test');

export const createTest = async (payload: CreateTestDto) => {
  return repo.create(payload);
};

export const getTestById = async (id: string) => {
  return repo.findById(id);
};

export const updateTestById = async (id: string, payload: UpdateTestDto) => {
  return repo.updateById(id, payload);
};

export const deleteTestById = async (id: string) => {
  return repo.deleteById(id);
};

export const listTests = async (dto: GetAllTestsDto) => {
  const result = await repo.list(dto);
  if (dto.page && dto.limit) {
    return {
      data: result.data,
      totalItems: result.total,
      currentPage: result.currentPage,
      itemsPerPage: result.limit,
    } as any;
  }
  return {
    data: result.data,
    totalItems: result.total,
  } as any;
};
