---
title: "Deploy automatizado do GLPI com Ansible"
date: "2025-10-13"
description: "Como instalar e fazer o deploy do software de TI GLPI, de maneira automatizada usando a ferramenta de configuração remota Ansible"
---

No post [Instalação & Deploy do GLPI](/blog/deploy-glpi/), foi discutido todo o processo de instalação e configuração do software GLPI. Foram abordados tópicos como a instalação de dependências e como elas interagem para possibilitar o uso do GLPI. Já neste post, será abordado como a ferramenta Ansible pode ser usada para automatizar todo esse processo.

## Lista de materiais

- Computador ou servidor para funcionar como o nó mestre
- Servidor Ubuntu 24.04 LTS, para hospedar o GLPI
- Domínio hospedado pela CloudFlare

## Passos

O processo de deploy é dividido nos seguintes passos:

- [Instalação do Ansible](/blog/glpi-ansible/#instalacao-do-ansible)
- [Deploy com Ansible](/blog/glpi-ansible/#deploy-com-ansible)

## Ansible

O Ansible é uma ferramenta usada para a automação de tarefas do mundo de TI, podendo ser usado para gerenciar configurações, implantar aplicativos e orquestrar essas e outras tarefas em diversos servidores remotos ao mesmo tempo. A ferramenta tem seu código fonte aberto, sendo escrito na linguagem Python.

Ele trabalha sem a necessidade de agentes serem instalados nos computadores (Agentless) para conseguir concluir suas tarefas. Em host Linux usa uma conexão SSH, e em hosts Windows, usa WinRM.

As tarefas que ele deve executar são configuradas na linguagem YAML, e separadas em Playbooks. Quando esses Playbooks se consolidam de forma lógica, podem ser configurados em um Role, onde uma série de tarefas são executadas com a finalidade de configurar uma aplicação, como um servidor Apache por exemplo. Essa característica possibilita a reutilização de Playbooks Ansible de maneira modular.

YAML é uma linguagem declarativa, e isso significa que cada passo da configuração é descrito em seu estado final. É o Ansible que fica encarregado de checar se existem diferenças entre a configuração atual e a alvo, e trabalhar para solucionar essas diferenças. Isso traz a característica de idempotência para a configuração de aplicativos e servidores, onde uma ação será executada apenas se houver tal necessidade.

### Instalação do Ansible

O nó de controle onde o Ansible será executado, deve ter um sistema operacional do tipo UNIX e a linguagem de programação Python3 instalada. Para ambientes Windows, é possível contornar essa restrição usando o [WLS - Windows Subsystem for Linux](https://learn.microsoft.com/pt-br/windows/wsl/about).

Os servidores que serão configurados também devem ter Python 3 instalado, SSH habilitado em sistemas UNIX e WinRM habilitado em sistemas Windows. Uma lista mais extensa dos requisitos pode ser encontrada no [site oficial do Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

Em sistemas operacionais Linux e no WSL, o Python pode ser instalado usando o gerenciador de pacotes nativo, como apt ou pacman. Os comando a seguir podem ser usados em um ambiente Linux derivado do Debian.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3
```

Com o Python instalado, devemos nos certificar que o Pip também foi instalado, usando o comando:

```bash
python3 -m pip -V
```

Esse comando deve retornar a versão instalada do Pip, caso ela não tenha sido retornada, o Pip deve ser instalado manualmente com:

```bash
sudo apt install python3-pip
```

Com todas as dependências instaladas, podemos finalizar a instalação do Ansible, executando o seguinte comando:

```bash
python3 -m pip install --user ansible
```

Com isso o Ansible terá sido instalado para o usuário que rodou o comando. Para checar que tudo está configurado como o esperado, use os comandos a seguir:

```bash
ansible --version
ansible-community --version
```

## Deploy com Ansible

Com o Ansible instalado no nó de controle, podemos começar a nos aprofundar um pouco mais nas características de um Playbook ou Role Ansible.

Como mencionado anteriormente, a ferramenta é configurada usando a linguagem YAML (Yet Another Markup Language), que é um subconjunto da linguagem JSON. Ela busca trazer mais clareza e legibilidade as configurações, usando indentação e quebra de linha para separar e organizar toda a configuração. Ela tem suporte para escalars (strings, números, booleanos, nulos), sequências (listas) e mapeamentos (chaves-valores).

### Sintaxe e exemplos básicos

Mapeamento entre chave e valor.

```yaml
nome: Maria Silva
idade: 30
ativo: true
```

Uma lista ou sequência de valores.

```yaml
clientes:
  - João
  - Ana
  - Pedro
```

Estrutura aninhada com mapeamentos e listas.

```yaml
aplicativo:
  nome: MeuApp
  versao: 1.0
  serviços:
    - nome: web
      porta: 8080
    - nome: db
      porta: 3306
```

### Passos do deploy

Seguindo a mesma estrutura do post original, os seguintes passos devem ser seguidos:

- Instalar dependências básicas
- Instalar e configurar o banco de dados
- Instalar e configurar os pacotes PHP
- Instalar e configurar o Apache2
- Instalar e configurar o GLPI
- Instalar e configurar o certbot

Cada um deles será baseado nos comandos e configurações definidas anteriormente e separado em um Role específico, trazendo modularidade ao projeto e a possibilidade de reutilizar essa configuração no futuro. Todo o código Ansible pode ser encontrado no repositório complementar a esse blog, [hospedado no GitHub](https://github.com/gabrielztk/gabrielkawall-labs).

Você pode baixar todo o repositório com o comando git:

```bash
git clone https://github.com/gabrielztk/gabrielkawall-labs.git
```

#### Estrutura do projeto

```bash
.
├── inventories/
│   └── production
├── group_vars/
│   └── all/
├── host_vars/
├── roles/
│   ├── dependencias/
│   ├── database/
│   ├── php/
│   ├── apache/
│   ├── glpi/
│   └── ssl/
├── playbook.yml
└── README.md
```

#### Configuração

Algumas modificações devem ser feitas nos arquivos de configuração para que o Playbook central funcione corretamente e chame os Roles de forma adequada.

Cada Playbook depende de um arquivo de inventário para saber quais servidores e computadores deve configurar. Como o objetivo aqui é instalar o GLPI em um único servidor, devemos configurar adequadamente o arquivo de inventário.

Modifique o arquivo inventories/production para que o alvo seja o seu servidor esperado.

```conf
[glpi_servers]
meu-servidor-glpi ansible_host=192.168.10.50 ansible_user=ubuntu
```

Em seguida, modifique as variáveis que os Roles irão usar, em Playbook.yml. Principalmente a versão do GLPI que você deseja instalar, e qual o domínio que será usado para o certificado SSL.

```yaml
glpi_version: "11.0.0"
glpi_domain: "glpi.meudominio.com"
```

Algumas das variáveis usadas são sensíveis, por isso devem ser guardadas de maneira segura. Um Vault Ansible é uma opção para fazer esse gerenciamento. Crie o cofre, defina uma senha e depois insira as variáveis e seus valores.

```bash
# Criar Vault
ansible-vault create group_vars/all/vault.yml

# Editar variáveis
ansible-vault edit group_vars/all/vault.yml
```

Variáveis sensíveis:

```yaml
mariadb_root_password: "minha_senha_secreta"
glpi_db_password: "senha_db_glpi"
glpi_admin_email: "admin@dominio.com"
cloudflare_api_token: "token_cloudflare"
ansible_become_password: "senha_sudo"
```

### Execução do Playbook

Com todo o ambiente configurado, resta executar o Playbook principal, que por sua vez executa os Roles configurados. Para isso, use o comando a seguir:

```bash
ansible-playbook -i inventories/production playbook.yml  --ask-vault-pass
```

- **--check** para simular sem alterar nada

- **--diff** para ver diferenças entre estado atual e desejado

- **--syntax-check** para verificar erros de sintaxe

## Resultado

O Playbook irá concluir as tarefas principais, que são definidas pelos Roles, a partir da execução de todas as sub-tarefas, que foram extraídas do tutorial original. O resultado será um servidor com o GLPI instalado e funcional, na versão que você configurou e que irá usar um certificado SSL para criptografar toda a comunicação entre o site e seus usuários.

Tentar acessar o IP diretamente resultará em erro, já que o sistema foi configurado para aceitar apenas conexões seguras. Por isso, antes de acessá-lo, você deve configurar seu servidor DNS local (ou registrar o domínio) para que glpi.meudominio.com aponte ao IP do servidor.

Assim, será possível acessar o site em <https://glpi.meudominio.com>
