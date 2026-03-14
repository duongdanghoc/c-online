import api from "./api";

interface RequestConsultationDto {
  name: string;
  phone: string;
  question: string;
  productSlug?: string;
}

export async function createConsultation(dto: RequestConsultationDto) {
  const response = await api.post("consultation", dto);
  return response;
}
