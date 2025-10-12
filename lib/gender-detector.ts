/**
 * Detecta o gênero baseado no nome do usuário
 * Usa terminações comuns em nomes brasileiros
 */

// Nomes femininos comuns e suas variações
const FEMALE_INDICATORS = [
  // Terminações femininas
  'a', 'ana', 'iana', 'iana', 'ela', 'isa', 'ina', 'ine', 'essa', 'ette',
  // Nomes compostos femininos
  'maria', 'ana', 'julia', 'juliana', 'fernanda', 'amanda', 'bruna', 'carla',
  'daniela', 'gabriela', 'isabela', 'isabella', 'leticia', 'letícia', 'lucia',
  'lucía', 'mariana', 'patricia', 'patrícia', 'paula', 'rafaela', 'renata',
  'roberta', 'sandra', 'silvia', 'sílvia', 'tatiana', 'vanessa', 'viviane',
  'adriana', 'alessandra', 'aline', 'beatriz', 'bianca', 'camila', 'carolina',
  'clara', 'cristina', 'debora', 'débora', 'elaine', 'fabiana', 'flavia',
  'flávia', 'helena', 'jaqueline', 'jessica', 'jéssica', 'joana', 'lara',
  'larissa', 'livia', 'lívia', 'marcela', 'marina', 'melissa', 'michelle',
  'monica', 'mônica', 'natalia', 'natália', 'priscila', 'raquel', 'rita',
  'rosana', 'sabrina', 'simone', 'sophia', 'sofia', 'tais', 'taís', 'thais',
  'thaís', 'valeria', 'valéria', 'veronica', 'verônica', 'vitoria', 'vitória'
]

// Nomes masculinos comuns e suas variações
const MALE_INDICATORS = [
  // Terminações masculinas
  'o', 'os', 'son', 'ton', 'der', 'ber', 'ger', 'mer', 'ner', 'ver',
  // Nomes compostos masculinos
  'joao', 'joão', 'jose', 'josé', 'antonio', 'antônio', 'carlos', 'paulo',
  'pedro', 'lucas', 'matheus', 'gabriel', 'rafael', 'rodrigo', 'fernando',
  'marcelo', 'andre', 'andré', 'bruno', 'diego', 'eduardo', 'fabio', 'fábio',
  'felipe', 'guilherme', 'gustavo', 'henrique', 'leonardo', 'luis', 'luís',
  'luiz', 'marcos', 'mario', 'mário', 'miguel', 'ricardo', 'roberto',
  'rodrigo', 'sergio', 'sérgio', 'tiago', 'victor', 'vitor', 'caio',
  'daniel', 'david', 'eric', 'erick', 'francisco', 'hugo', 'igor', 'ivan',
  'julio', 'júlio', 'leandro', 'murilo', 'otavio', 'otávio', 'renan',
  'renato', 'samuel', 'thiago', 'vinicius', 'vinícius', 'vitor', 'geison'
]

export type Gender = 'male' | 'female' | 'neutral'

export function detectGender(name: string): Gender {
  if (!name) return 'neutral'

  const normalizedName = name.toLowerCase().trim()

  // Verifica se é um nome feminino conhecido
  const isFemale = FEMALE_INDICATORS.some(indicator => {
    if (indicator.length <= 3) {
      // Para terminações curtas, verifica se termina com
      return normalizedName.endsWith(indicator)
    } else {
      // Para nomes completos, verifica se contém ou é igual
      return normalizedName.includes(indicator) || normalizedName === indicator
    }
  })

  if (isFemale) return 'female'

  // Verifica se é um nome masculino conhecido
  const isMale = MALE_INDICATORS.some(indicator => {
    if (indicator.length <= 3) {
      // Para terminações curtas, verifica se termina com
      return normalizedName.endsWith(indicator)
    } else {
      // Para nomes completos, verifica se contém ou é igual
      return normalizedName.includes(indicator) || normalizedName === indicator
    }
  })

  if (isMale) return 'male'

  // Se não conseguiu detectar, usa heurística de terminação
  if (normalizedName.endsWith('a')) return 'female'
  if (normalizedName.endsWith('o')) return 'male'

  return 'neutral'
}

export function getGenderEmoji(gender: Gender): string {
  switch (gender) {
    case 'female':
      return '👩'
    case 'male':
      return '👨'
    default:
      return '👤'
  }
}

export function getGenderLabel(gender: Gender): string {
  switch (gender) {
    case 'female':
      return 'Feminino'
    case 'male':
      return 'Masculino'
    default:
      return 'Não especificado'
  }
}
