# 🎲 Joguinho Aleatório - Análise Estatística Avançada

![Status](https://img.shields.io/badge/status-concluído-success)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML](https://img.shields.io/badge/HTML5-orange)
![CSS](https://img.shields.io/badge/CSS3-blue)
![Chart.js](https://img.shields.io/badge/Chart.js-visualização-red)

---

## 📌 Sobre o Projeto

Este projeto transforma um jogo simples baseado em sorte em um **ambiente de simulação estatística**.

A proposta é analisar quantos cliques são necessários, em média, para vencer o jogo, utilizando **testes automatizados em larga escala**.

---

## 🎯 Objetivo

- Testar o jogo até alcançar a vitória  
- Automatizar múltiplas execuções  
- Coletar métricas estatísticas  
- Comparar resultados com a teoria  

---

## 🕹️ Como funciona

- Um número aleatório entre **1 e 20** é definido como objetivo  
- A cada clique, um novo número aleatório é gerado  
- O jogo termina quando os números coincidem  
- O número de cliques até a vitória é registrado  

---

## 🤖 Sistema de Testes

O sistema permite executar simulações automaticamente:

| Tipo de Teste | Quantidade |
|------|--------|
| Manual | Clique do usuário |
| Automático | 10, 100, 1.000, 10.000 |
| ⚡ Turbo | 100.000+ partidas |

---

## 📊 Métricas coletadas

- 📈 Média de cliques  
- 📉 Desvio padrão  
- 🟢 Mínimo / 🔴 Máximo  
- 📊 Percentis (P50, P75, P90, P95, P99)  
- ⚡ Performance (testes por segundo)  

---

## 📐 Fundamentação Teórica

O jogo segue uma **distribuição geométrica**:

P(X = k) = (1 - p)^(k-1) * p

Onde:

- `p = 1/20 = 0.05`

Média teórica:

E(X) = 1 / p = 20


---

## 📈 Visualização de Dados

O sistema apresenta:

- 📊 Histograma da distribuição real  
- 📉 Curva teórica sobreposta  
- 📊 Comparação entre teoria e prática  

---

## 🧠 Conceitos aplicados

- Lei dos Grandes Números  
- Distribuição Geométrica  
- Probabilidade discreta  
- Convergência estatística  

---

## 📥 Exportação

Os dados podem ser exportados em:

- 📄 CSV (Excel)  
- 📋 JSON (análise de dados)  

---

## ⚙️ Tecnologias

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Chart.js  

---

## 🚀 Como executar


    # 1. Clone ou baixe o projeto
    # 2. Abra o arquivo HTML no navegador

Ou simplesmente:

Dê dois cliques no arquivo .html

---

### 📊 Resultado esperado

Após múltiplas simulações:

A média tende a ~20 cliques
O erro percentual diminui com mais testes
A distribuição se aproxima da curva teórica

---

### 🏁 Conclusão

O projeto demonstra, na prática, como um sistema aleatório simples pode ser analisado estatisticamente.

Com simulações em larga escala, é possível validar matematicamente o comportamento do jogo.

---

### 👩‍💻 Autora

Éllen Dias Farias

---

### 📄 Licença

Este projeto é acadêmico e de uso educacional.
