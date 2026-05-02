/**
 * Formata um valor monetário para o padrão brasileiro (R$), 
 * garantindo que nunca arredonde para cima (truncamento) 
 * e mostre exatamente 2 casas decimais.
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0,00';
  
  // Truncar para 2 casas decimais sem arredondar
  const truncated = Math.floor(value * 100 + 0.0001) / 100;
  
  return truncated.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Retorna apenas o valor numérico formatado com 2 casas decimais (truncado),
 * sem o prefixo R$.
 */
export const formatNumberTruncated = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0,00';
  
  const truncated = Math.floor(value * 100 + 0.0001) / 100;
  
  return truncated.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formata uma data para o padrão brasileiro (dd/mm/yyyy).
 */
export const formatDate = (dateString) => {
  if (!dateString) return '---';
  // Adiciona um T12:00:00 para evitar que a data mude por causa do fuso horário
  // ao converter strings simples de data (YYYY-MM-DD)
  const date = new Date(dateString.includes('T') ? dateString : `${dateString}T12:00:00`);
  if (isNaN(date.getTime())) return '---';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formata uma data e hora para o padrão brasileiro (dd/mm/yyyy HH:mm).
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '---';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
