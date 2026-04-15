from fastapi import APIRouter
from sqlalchemy import select
from app.core.database import async_session
from app.models.models import PageContent
from app.schemas.schemas import HomePageOut

router = APIRouter(prefix="/api/v1/pages", tags=["pages"])


@router.get("/home", response_model=HomePageOut)
async def get_home():
    """Return all page sections combined."""
    async with async_session() as session:
        result = await session.execute(select(PageContent))
        rows = result.scalars().all()

        sections = {row.section: row.content for row in rows}

        # Default content for sections not yet created
        defaults = {
            "hero": {
                "tag": "Florianópolis, SC · Desenvolvedor de software desde 2008",
                "title": "+16 anos construindo<br>software. Agora com<br><em>IA no centro</em>.",
                "subtitle": "Sou Carlos Eduardo Lobo — desenvolvedor de software com formação em 2008 e mais de uma década e meia construindo sistemas que resolvem problemas reais. Hoje desenvolvo sistemas sob medida e ofereço consultoria técnica com IA aplicada onde realmente faz diferença.",
                "cta_text": "Agendar uma conversa",
                "cta_secondary": "Sobre mim",
                "avatar_url": "",
                "cover_url": "",
                "logo_url": "",
            },
            "stats": {
                "items": [
                    {"value": "2008", "label": "formado em TI"},
                    {"value": "+16 anos", "label": "desenvolvendo software"},
                    {"value": "3 produtos", "label": "próprios no mercado"},
                    {"value": "Sistemas", "label": "e consultorias"},
                ]
            },
            "sobre": {
                "sticky_title": "Software primeiro.<br>IA como <em>evolução</em><br>natural.",
                "paragraphs": [
                    "Me formei em 2008 e desde então venho construindo software para resolver problemas reais. Sistemas, APIs, integrações, automações — passei por praticamente todos os estágios do desenvolvimento: do código mal escrito que ninguém quer manter até a arquitetura que <strong>realmente sustenta o crescimento de uma empresa</strong>.",
                    "Com o avanço da inteligência artificial, vi uma oportunidade que poucos estavam aproveitando direito: aplicar IA não como tendência, mas como parte estrutural do desenvolvimento e da operação. Não para impressionar — para <strong>funcionar melhor</strong>.",
                    "O padrão que observei se repete: empresas testam ferramentas de IA de forma isolada, criam automações frágeis e continuam com os mesmos gargalos de antes. Falta base. Falta visão de sistema. É esse gap que eu resolvo — entregando estrutura, clareza e execução real.",
                    "Hoje combino mais de 16 anos de experiência em desenvolvimento com uma visão prática de IA aplicada — e compartilho isso com quem quer construir algo mais sólido, eficiente e difícil de copiar.",
                ]
            },
            "especialidades": {
                "cards": [
                    {"num": "01", "title": "Desenvolvimento de software", "description": "Mais de 16 anos construindo sistemas, APIs, integrações e ferramentas que resolvem problemas reais — com qualidade, clareza e visão de longo prazo."},
                    {"num": "02", "title": "Arquitetura de sistemas", "description": "Pensar antes de codar. Estruturar a solução certa para o problema certo — seja um sistema novo, legado que precisa evoluir ou operação que precisa de escala."},
                    {"num": "03", "title": "IA aplicada na operação", "description": "Identificar onde a IA realmente agrega valor no contexto da empresa — e implementar de forma que funcione na prática, não só na demo."},
                    {"num": "04", "title": "Automação inteligente", "description": "Eliminar tarefas manuais e gargalos operacionais com automações que fazem sentido para o negócio — não automações por moda."},
                ]
            },
            "portfolio": {
                "projects": [
                    {"tag": "Open source · Framework · CLI-first", "title": "AIOS CELX", "description": "Framework open source para organizar desenvolvimento com IA. Workflows, agentes, backlog, memória e automação governada em um único sistema.", "url": "carlos-lobo-celx.html"},
                    {"tag": "Produto em produção · Plataforma com IA", "title": "Creative IA Studio", "description": "Plataforma de ensaios fotográficos com IA para clientes finais. O cliente envia fotos, escolhe o estilo e recebe um ensaio profissional — sem estúdio, sem fotógrafo.", "url": "https://creativeiastudio.com/ensaio-fotografico-ia"},
                ]
            },
            "livro": {
                "title": "Desenvolvimento com IA na Prática",
                "subtitle": "Guia corporativo para empresas de software que querem aplicar IA no dia a dia",
                "serie": "Série AI-First na Prática — Livro 1",
                "author": "Carlos Eduardo Lobo",
                "description": "A Inteligência Artificial já está mudando a forma como software é construído. Este guia corporativo mostra como utilizar IA no fluxo real de desenvolvimento — com mais velocidade, qualidade e eficiência operacional.",
                "bullets": [
                    "Criar features com mais velocidade",
                    "Estruturar prompts melhores para código",
                    "Acelerar debug e refatoração",
                    "Gerar testes e documentação com mais eficiência",
                    "Automatizar tarefas repetitivas do fluxo de desenvolvimento",
                    "Aplicar IA no código real da empresa com segurança"
                ],
                "cta_text": "Comprar na Amazon",
                "cta_secondary": "Ver detalhes do livro",
                "amazon_url": "https://www.amazon.com.br/Desenvolvimento-com-IA-Pr%C3%A1tica-corporativo-ebook/dp/B0F9L6PRWL"
            },
            "artigos": {
                "articles": [
                    {"tag": "IA aplicada · Leitura essencial", "title": "O problema não é falta de IA. É falta de estrutura para aplicá-la do jeito certo.", "url": "#"},
                    {"tag": "Desenvolvimento · Processo", "title": "Por que sua automação vai falhar em 3 meses", "url": "#"},
                    {"tag": "Operação · Estratégia", "title": "A diferença entre empresa que experimenta IA e empresa que constrói com ela", "url": "#"},
                ]
            },
            "servicos": {
                "services": [
                    {"num": "01 / desenvolvimento", "title": "Sistemas sob medida", "description": "APIs, painéis, integrações e ferramentas internas desenvolvidos do zero — com foco em funcionalidade, qualidade e capacidade de evoluir com o seu negócio."},
                    {"num": "02 / consultoria", "title": "Diagnóstico técnico", "description": "Mapeio gargalos técnicos e operacionais e indico onde IA, automação ou reestruturação de software podem gerar impacto real — sem achismo, sem hype."},
                    {"num": "03 / automação", "title": "Automação com IA", "description": "Identifico onde a operação perde tempo e construo automações que realmente funcionam — conectadas ao contexto do negócio, não isoladas."},
                    {"num": "04 / modernização", "title": "Evolução de software legado", "description": "Refatoro, organizo e modernizo sistemas existentes para que fiquem mais fáceis de manter, evoluir e escalar — sem precisar reconstruir tudo do zero."},
                ]
            },
            "contato": {
                "title": "Vamos construir algo <strong>incrível</strong> juntos?",
                "subtitle": "Estou sempre aberto a novos projetos, ideias e parcerias.",
                "whatsapp_url": "https://wa.me/5548988114708",
                "linkedin_url": "https://www.linkedin.com/in/carlos-eduardo-lobo/",
                "instagram_url": "https://www.instagram.com/carloslobo.tech/",
                "tiktok_url": "https://www.tiktok.com/@carloslobo.tech",
            },
        }

        def get_section(name: str) -> dict:
            return sections.get(name) or defaults.get(name, {})

        return HomePageOut(
            hero=get_section("hero"),
            stats=get_section("stats"),
            sobre=get_section("sobre"),
            especialidades=get_section("especialidades"),
            portfolio=get_section("portfolio"),
            livro=get_section("livro"),
            servicos=get_section("servicos"),
            contato=get_section("contato"),
        )
