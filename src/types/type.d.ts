interface User {
  id: string
  name: string
  nickname: string
  email: string
  telefone: string
  email_verified_at: string | null
  user_foto: string
  plataforma: string
  data_de_compra: string
  data_de_renovacao: string
  first_login: boolean
  first_desafio: boolean
  sexo: string | null
  localizacao: string | null
  localizacao_pais: string | null
  localizacao_estado: string | null
  localizacao_cidade: string | null
  changelogged_at: string
  created_at: string
  updated_at: string
  data_nascimento: string | null
  last_login: string
  codigo_indicacao: string | null
  my_affiliate_code: string | null
  tutorial_complete: string
  login_streak: string
  score: string
  login_tag: string
  plan: string
  status_plan: string
  level: string
  roles: {
    id: number
    name: string
    guard_name: string
    created_at: string
    updated_at: string
    pivot: {
      model_type: string
      model_id: string
      role_id: string
    }
  }[]
}

interface Book {
  id: number
  nota_id: unknown
  titulo: string
  autor: string | null
  capa?: string | null
  categorias: string[] | null
  formato: string
  emprestado: unknown
  avaliacao: string
  status: string
  link: string
  deleted_at: unknown
  created_at: string
  updated_at: string
}

interface ApiError {
  status: number
  error: string
  message: string
}
interface Video {
  categorias: string[] | null
  id: number
  nota_id: string | null
  titulo: string
  capa: string | null
  avaliacao: string
  status: string
  link: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

interface Course {
  id: number
  nota_id: string | null
  titulo: string
  capa?: string
  categorias?: string[]
  avaliacao: string
  status: string
  link: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

interface CalendarEvent {
  compromisso_id: number
  compromisso_id_original: string
  titulo: string
  descricao: string
  comeca: string
  termina: string
  repete: boolean
  repete_intervalo_quantidade: string
  repete_intervalo_tipo: string
  repete_intervalo_dias: string[]
  repete_opcao_termino: unknown
  repete_termino_ocorrencias: string
  repete_termino_data: unknown
  created_at: string
  updated_at: string
  checked: boolean
}

interface Checklist {
  id: number
  tarefa_id: number
  name: string
  subtasks: {
    id: number
    name: string
    checked: string
  }[]
}

interface Tag {
  id: number
  color: string
  name: string
}

interface Task {
  tarefa_id: number | string
  index: number | string
  position: number | string
  prioridade: 'Prioridade Alta' | 'Prioridade Média' | 'Prioridade Baixa'
  card_id: number | string
  item: string
  descricao: string | null
  checked: boolean
  checklists?: Checklist[]
  task_tickets?: Tag[]
}

interface TaskList {
  id: number | string
  title: string
  position: number
  tarefas: Task[]
}

interface PomodoroResponse {
  pomodoro_id: number
  sessoes_definidas: string
  sessoes_feitas: string
  minutagem_meta_produtividade: string
  minutagem_meta_estudos: string
  minutagem_produtividade: string
  minutagem_feita_produtividade: string
  minutagem_estudos: string
  minutagem_feita_estudos: string
  intervalo_curto: string
  intervalo_longo: string
  data: string
  created_at: string
  updated_at: string
}

interface Wallet {
  carteira_id: number
  financeiro_id: string
  titulo: string
  banco: string
  saldo: string
  tipo: string
  categoria: string
  agencia: string | null
  conta: string | null
  descricao: string | null
  created_at: string
  updated_at: string
}

interface Transaction {
  transacao_id: number
  financeiro_id?: string
  tipo:
    | 'entrada'
    | 'receita_fixa'
    | 'receita_variavel'
    | 'receita_outros'
    | 'saida'
    | 'custo_fixo'
    | 'custo_variavel'
    | 'custo_outros'
  categoria: string | null
  descricao: string | null
  valor: string
  data: string
  created_at: string
  updated_at: string
  user_id: string
  parcela_inicial_id: string | null
  num_parcela: string | null
  titulo: string
  forma_de_pagamento?: string
  checked: boolean
  carteira_id: string | null
}

interface Note {
  id: string
  pasta_id: string
  nome: string
  cor: string | null
  descricao: string
  fixada: boolean
  updated_at?: string
  deleted_at?: string | null
}

interface Folder {
  id: string
  pasta_pai: string | null
  nome: string
  fixada: boolean
  index?: string
  global?: boolean
  notas: Note[]
  deleted_at?: string | null
}

interface Compromisso {
  compromisso_id: number
  compromisso_id_original?: string
  event_id?: string
  titulo: string
  descricao?: string
  comeca: string
  termina: string
  repete: boolean
  repete_intervalo_quantidade?: string | null
  repete_intervalo_tipo?: string | null
  repete_intervalo_dias: string[]
  repete_opcao_termino?: string | null
  repete_termino_ocorrencias?: string | null
  repete_termino_data?: string | null
  created_at?: string
  updated_at?: string
  checked: boolean
  categoria: string
}

interface Alimento {
  alimento_id: number
  horario_id: string
  nome_alimento: string
  quantidade: string
  created_at?: string
  updated_at?: string
}

interface RefeicoesOld {
  horario_id: number
  nome_refeicao: string
  hora_refeicao: string
  observacoes?: string
  created_at?: string
  updated_at?: string
  dia_semana: string
  alimentos: Alimento[]
}

interface TreinosOld {
  treino_id: number
  chave: string
  inicio: string
  fim: string
  metadata: string[]
  created_at?: string
  updated_at?: string
}

interface EventsDTO {
  compromissos: Compromisso[]
  refeicoes_old: RefeicoesOld[]
  treinos_old: TreinosOld[]
}

interface GoogleEvent {
  compromisso_id?: string
  error?: string
  event_id: string
  user_id: string
  created_at: string
  updated_at: string
  titulo: string
  descricao?: string
  comeca: string
  termina: string
  checked: boolean
  repete: number
  repete_intervalo_quantidade?: string | null
  repete_intervalo_tipo?: string | null
  repete_intervalo_dias?: string | null
  repete_opcao_termino?: string | null
  repete_termino_ocorrencias?: string | null
  repete_termino_data?: string | null
  link_hangout?: string | null
  color_id?: string | null
  collection_key?: string | null
  start: {
    date?: string
    dateTime?: string
    timeZone?: string
  }
  end: {
    date?: string
    dateTime?: string
    timeZone?: string
  }
  periodo: string
  categoria: 'google'
}

interface GoogleEventsResponse {
  error?: {
    message: string
    code: number
  }
  events?: GoogleEvent[]
}
interface AulaFeedback {
  aula_feedback_id: number
  aula_id: string
  user_id: string
  status?: string
  concluido: string
  created_at: string
  updated_at: string
}

interface Aula {
  aula_id: number
  modulo_id: string
  titulo: string
  descricao: string
  categoria: string
  imagens: string | null
  arquivos: string | null
  video: string
  capa: string | null
  duracao: string
  like: string
  dislikes: string
  created_at: string
  updated_at: string
  aula_feedback?: AulaFeedback
}

interface Modulo {
  modulo_id: number
  conteudo_id: string
  titulo: string
  descricao: string | null
  created_at: string
  updated_at: string
  aulas: Aula[]
}

interface Conteudo {
  conteudo_id: number
  titulo: string
  descricao?: string | null
  categoria: string
  banner: string
  disponivel: string
  created_at: string
  updated_at: string
  modulos: Modulo[]
}

interface Comentario {
  comentario_id: number
  texto: string
  status: string
  data: string
  created_at: string
  nome: string
  foto: string
  comentario_pai?: number
  filhos?: Comentario[]
}

interface ComentarioDTO {
  comentarios: Comentario[]
  current_page: number
  total_pages: number
  total_comments: number
}

interface AffiliateDTO {
  valorHoje: number
  valorOntem: number
  valorTotal: number
  valorMesAtual: number
  valorMesAnterior: number
  valoresUltimosSeteDias: { [key: string]: number }
}

interface ArrayDia {
  dia: number
  status: string
  texto: string
  marcacao: string
  data: string
}

interface DesafioCommandment {
  id: number
  completed: boolean
  commandment: {
    number: string
    title: string
    short_description: string
  }
}

interface Challenge {
  desafio_id: number
  modalidade: string
  array_comprometimento: string[]
  array_falhar: string[]
  situacao_inicial: string | null
  textarea_oque_motivou: string
  textarea_sentimento_inicial: string | null
  textarea_oque_deseja: string
  textarea_desabafo: string | null
  fotos_situacao_inicial: string[] | null
  situacao_final: string | null
  relato_conquistas: string | null
  fotos_situacao_final: string[] | null
  status_desafio: string
  array_dias: ArrayDia[]
  hojeInfo: string | null
  created_at: string
  updated_at: string
  data_de_inicio: string
  fotos_oque_motivou_inicial: string[] | null
  fotos_oque_motivou_final: string[] | null
  desafio_commandment: DesafioCommandment[]
  meta?: {
    target: number
    target_percent: number
    dias_feitos: number
    feitos_percent: number
    contagem: number
  }
  dia_atual?: number
  positive_days_count: number
  negative_days_count: number
  neutral_days_count: number
}

interface Commandment {
  number: string
  title: string
  description: string
  short_description: string
  how_to_do: string
  bonus?: string | null
  extra_text?: string | null
  medias: {
    type: string
    url: string
  }[]
}

interface Goal {
  metas_id: number
  user_id: string
  ano: string
  objetivos: {
    principal: string
    lista: {
      valor: string
      item: string
      ano: number
      checked: boolean
    }[]
  }
  fotos: {
    foto: string
    posicao: number
    tipo: string
    id: string
    rotation: number
    width: string
    height: string
    x: string
    y: string
  }[]
  created_at: string
  updated_at: string
  metas_anuais: {
    tipo: string
    valor?: string
    completo: number
    ano?: number
    position: number
  }[]
}

interface LockedMessage {
  id: number
  titulo: string
  conteudo: string | null
  descricao: string
  data_abertura: string
  data_fechamento: string
  status_carta_aberta: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  data_filepath: string
  upload_filepath: string | null
}

interface UserProfile {
  id: string
  user_id: string
  biography: string | null
  instagram: string | null
  linkedin: string | null
  banner: string | null
  created_at: string
  updated_at: string
  num_notifications: number
  nickname: string
  foto_perfil: string | null
}

interface Post {
  id: number
  content: string
  midia: string[] | null
  status: string
  category: 'Experiência' | 'Indicações' | 'Oportunidades'
  perfil_id: string
  post_id: number | null
  created_at: string
  updated_at: string
  likes: number
  views: number
  reborts: number
  comments: number
  user_likeed: boolean
  user_viewed: boolean
  user_reborted: boolean
  author: UserProfile
}

interface PostDTO {
  current_page: number
  data: Post[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url?: string
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

interface Notification {
  id: number
  message: string
  perfil_id: string
  sender_id: string
  interaction: string
  is_read: boolean
  post_id: string
  created_at: string
  updated_at: string
  sender: UserProfile
}

interface NotificationDTO {
  current_page: number
  data: Notification[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

interface Reminder {
  nao_esquecer_id: number
  checked: boolean
  item: string
  descricao?: string
  deleted_at: string | null
  created_at: string
  updated_at: string
  completed_at?: string
}

interface Song {
  id: number
  title: string
  banner: string
  url: string
  playlist_id: string
  created_at: string
  updated_at: string
  duration: string
}

interface Playlist {
  id: number
  title: string
  description: string
  banner: string | null
  created_at: string
  updated_at: string
  numMusics: number
}

interface Configuracoes {
  id: number
  user_id: string
  google_oauth: string
  refresh_token: string
  expires_at: string
  created_at: string
  updated_at: string
  central_tema: boolean
  modal_flow: boolean
  notificacao: boolean
}
