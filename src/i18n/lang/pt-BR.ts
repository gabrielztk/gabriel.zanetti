import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Início",
    posts: "Artigos",
    tags: "Tags",
    about: "Contato",
    archives: "Arquivo",
    search: "Buscar",
  },
  post: {
    publishedAt: "Publicado em",
    updatedAt: "Atualizado",
    sharePostIntro: "Compartilhe este artigo:",
    sharePostOn: "Compartilhe este artigo em {{platform}}",
    sharePostViaEmail: "Compartilhe este artigo por email",
    tagLabel: "Tags",
    backToTop: "Voltar ao topo",
    goBack: "Voltar",
    editPage: "Editar página",
    previousPost: "Artigo anterior",
    nextPost: "Próximo artigo",
  },
  pagination: {
    prev: "Anterior",
    next: "Próxima",
    page: "Página",
  },
  home: {
    socialLinks: "Redes sociais",
    featured: "Destaques",
    recentPosts: "Publicações recentes",
    allPosts: "Todos os artigos",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "Todos os direitos reservados.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "Artigos com a tag",

    tagsTitle: "Tags",
    tagsDesc: "Tags dos artigos.",

    postsTitle: "Artigos",
    postsDesc: "Todos os artigos publicados.",

    archivesTitle: "Arquivo",
    archivesDesc: "Artigos por data de publicação.",

    searchTitle: "Buscar",
    searchDesc: "Busque um artigo ...",
  },
  a11y: {
    skipToContent: "Ir para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toggleTheme: "Alternar tema",
    searchPlaceholder: "Buscar artigos...",
    noResults: "Nenhum resultado encontrado",
    goToPreviousPage: "Ir para a página anterior",
    goToNextPage: "Ir para a próxima página",
  },
  notFound: {
    title: "404 — Página não encontrada",
    message: "Página não encontrada",
    goHome: "Voltar ao início",
  },
} satisfies UIStrings;
