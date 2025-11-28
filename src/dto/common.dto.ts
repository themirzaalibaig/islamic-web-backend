import { StatusEnum } from '@/enums';

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface SortDto {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchDto {
  search?: string;
  fields?: string[];
}

export interface DateRangeDto {
  startDate?: Date;
  endDate?: Date;
}

export interface StatusDto {
  status?: StatusEnum;
}

export interface IdDto {
  id?: string;
}

export interface UuidDto {
  uuid?: string;
}

export interface SlugDto {
  slug?: string;
}

export interface TagsDto {
  tags?: string[];
}

export interface CategoryDto {
  category?: string;
}

export interface AuthorDto {
  author?: string;
}

export interface LanguageDto {
  language?: string;
}

export interface VisibilityDto {
  visibility?: 'public' | 'private' | 'draft';
}

export interface ActiveDto {
  active?: boolean;
}

export interface DeletedDto {
  deleted?: boolean;
}

export interface FeaturedDto {
  featured?: boolean;
}

export interface PopularDto {
  popular?: boolean;
}

export interface LocationDto {
  latitude?: number;
  longitude?: number;
}

export interface AddressDto {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ContactDto {
  email?: string;
  phone?: string;
}

export interface SocialMediaDto {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface MetadataDto {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface SeoDto extends MetadataDto {
  canonicalUrl?: string;
  ogImage?: string;
}

export interface SettingsDto {
  settings?: Record<string, any>;
}

export interface PreferencesDto {
  preferences?: Record<string, any>;
}

export interface PermissionsDto {
  permissions?: string[];
}

export interface QueryDto extends PaginationDto, SortDto, SearchDto, DateRangeDto, ActiveDto {}

export interface IdParams {
  id: string;
}
