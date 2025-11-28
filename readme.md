# Comparativo de Desempenho: Nginx vs Apache (Docker + Observabilidade)

**Aluno:** Elder Matheus Maia de Oliveira

## Sobre o Projeto
Este projeto implementa uma infraestrutura containerizada para comparar o desempenho de dois servidores web (Nginx e Apache) sob estresse. Utiliza-se a stack Prometheus + Grafana para monitoramento e k6 para geração de carga.

A rede foi configurada na sub-rede `98.52.0.0/24` conforme exigência dos últimos quatro digitos da matrícula.

## Como executar

### Pré-requisitos
* Docker e Docker Compose instalados.

### 1. Inicializar o ambiente
No terminal, dentro da pasta raiz, execute:

```bash
# caso não exista o arquivo index.html na pasta conteudo, rode este comando abaixo.
mkdir -p conteudo && echo "<h1>Teste de Redes II - Elder Matheus</h1>" > conteudo/index.html

# para subir os containers
docker compose up -d
```

### 2. Verificar os Serviços
Antes de iniciar os testes, verifique se os coletores de métricas estão funcionando:

1. Acesse `http://localhost:9090/targets` no seu navegador.
2. Verifique se os endpoints `nginx_exporter` e `apache_exporter` estão com status **UP** (Verde).


## Configuração do Grafana

Como os dashboards não foram configurados via provisionamento automático, siga estes passos para visualizar os gráficos:

1. **Acesse:** `http://localhost:3000`
   * **Login:** `admin`
   * **Senha:** `admin` (pule a etapa de mudar a senha).

2. **Adicionar Fonte de Dados (Prometheus):**
   * No menu lateral, vá em **Connections** -> **Data Sources**.
   * Clique em **+ Add new data source**.
   * Selecione **Prometheus**.
   * No campo "Prometheus server URL", digite exatamente: `http://prometheus:9090`
   * Role até o final e clique em **Save & Test**. Se aparecer uma mensagem verde, é porque deu certo.

3. **Visualizar os Gráficos:**
   * Vá em **Explore** (ícone de bússola no menu lateral).
   * No topo, certifique-se de que a fonte "Prometheus" está selecionada.
   * Cole a seguinte query para ver a comparação de tráfego entre Nginx e Apache:
     ```promql
     rate(nginx_http_requests_total[1m]) OR rate(apache_accesses_total[1m])
     ```
   * Clique em **Run Query**.

---

## Executando o Teste de Carga (k6)

Com o ambiente rodando e o Grafana aberto, execute o script de teste de carga. 

```bash
docker run --rm -i \
--network redes_ii_av3_minha_rede \
-v $(pwd)/k6/test.js:/test.js \
grafana/k6 run /test.js
```

### Devido a uma incompatibilidade técnica entre com o agente cAdvisor, a coleta de métricas de hardware foi realizada via ferramenta nativa.

Enquanto o teste do k6 roda, abra um novo terminal e execute este comando:
```bash
docker stats
```
