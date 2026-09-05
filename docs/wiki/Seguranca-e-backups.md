# Segurança e backups

## Regras essenciais

- Guardar segredos apenas em variáveis de ambiente.
- Não publicar `.env`, dumps ou dados reais.
- Utilizar queries parametrizadas.
- Aplicar o princípio do menor privilégio ao utilizador PostgreSQL.
- Utilizar transações em compras e vendas que alterem stock.

## Política de backup proposta

- Frequência diária às 02:00.
- Destino configurável fora do disco principal.
- Retenção de 30 dias.
- Compressão ativa.
- Registo do resultado e teste periódico de restauro.

Um backup só é considerado válido depois de ser testado através de um processo de restauro.
