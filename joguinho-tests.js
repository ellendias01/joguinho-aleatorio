// ==================== CÓDIGO ORIGINAL DO JOGO ====================
let numeroEsperado = Math.floor(Math.random() * 20) + 1;
let ganhou = false;
let cliquesRodada = 0;

document.getElementById("numeroEsperado").textContent = numeroEsperado;

document.getElementById("incrementador").addEventListener("click", function(event) {
    event.preventDefault(); // CORRIGIDO: adicionado ()

    if (ganhou) {
        let mensagemJaGanhou = document.createElement("p");
        mensagemJaGanhou.textContent = "⚠️ Você já ganhou, pare de clicar!";
        document.getElementById("resultado").appendChild(mensagemJaGanhou);
        return;
    }

    cliquesRodada++;

    let numeroAleatorio = Math.floor(Math.random() * 20) + 1;
    let novoParagrafo = document.createElement("p");
    novoParagrafo.textContent = numeroAleatorio;
    document.getElementById("resultado").appendChild(novoParagrafo);

    if (numeroAleatorio === numeroEsperado) {
        novoParagrafo.textContent += " 🎉 - Você ganhou!!! 🎉";
        ganhou = true;
        
        if (typeof registrarVitoriaManual === 'function') {
            registrarVitoriaManual(cliquesRodada);
        }
    }
});

function reiniciarJogoManual() {
    numeroEsperado = Math.floor(Math.random() * 20) + 1;
    ganhou = false;
    cliquesRodada = 0;
    document.getElementById("numeroEsperado").textContent = numeroEsperado;
    document.getElementById("resultado").innerHTML = "";
}

// ==================== SISTEMA DE TESTES E MÉTRICAS ====================

let todosCliques = [];
let testando = false;
let modoTurbo = false;
let histogramaChart = null;
const MEDIA_TEORICA = 20;
const PROBABILIDADE = 0.05;

// Função para calcular percentil
function calcularPercentil(arr, p) {
    if (arr.length === 0) return '-';
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

// Função para calcular todos os percentis
function calcularTodosPercentis(arr) {
    if (arr.length === 0) {
        return { p50: '-', p75: '-', p90: '-', p95: '-', p99: '-' };
    }
    return {
        p50: calcularPercentil(arr, 50),
        p75: calcularPercentil(arr, 75),
        p90: calcularPercentil(arr, 90),
        p95: calcularPercentil(arr, 95),
        p99: calcularPercentil(arr, 99)
    };
}

// Função para calcular desvio padrão
function calcularDesvioPadrao(arr) {
    if (arr.length < 2) return '-';
    const media = arr.reduce((a, b) => a + b, 0) / arr.length;
    const squareDiffs = arr.map(value => Math.pow(value - media, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(avgSquareDiff).toFixed(2);
}

// Função para calcular distribuição geométrica teórica
function distribuicaoGeometrica(k, p) {
    // P(X = k) = (1-p)^(k-1) * p
    return Math.pow(1 - p, k - 1) * p;
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const partidas = todosCliques.length;
    if (partidas === 0) {
        document.getElementById("partidas").textContent = "0";
        document.getElementById("totalCliques").textContent = "0";
        document.getElementById("media").textContent = "0";
        document.getElementById("desvioPadrao").textContent = "-";
        document.getElementById("diferencaTeorica").textContent = "-";
        document.getElementById("erroPercentual").textContent = "-";
        document.getElementById("convergencia").textContent = "-";
        document.getElementById("p50").textContent = "-";
        document.getElementById("p75").textContent = "-";
        document.getElementById("p90").textContent = "-";
        document.getElementById("p95").textContent = "-";
        document.getElementById("p99").textContent = "-";
        document.getElementById("minimo").textContent = "-";
        document.getElementById("maximo").textContent = "-";
        return;
    }
    
    const totalCliques = todosCliques.reduce((a, b) => a + b, 0);
    const media = totalCliques / partidas;
    const minimo = Math.min(...todosCliques);
    const maximo = Math.max(...todosCliques);
    const desvioPadrao = calcularDesvioPadrao(todosCliques);
    const diferenca = Math.abs(media - MEDIA_TEORICA);
    const erroPercentual = ((diferenca / MEDIA_TEORICA) * 100).toFixed(2);
    
    // Calcular convergência
    let convergencia = "Coletando dados...";
    if (partidas >= 1000) {
        if (erroPercentual < 5) convergencia = "✅ Convergência atingida!";
        else if (erroPercentual < 10) convergencia = "🟡 Convergindo...";
        else convergencia = "🔴 Mais testes necessários";
    } else if (partidas >= 100) {
        convergencia = "🟡 Aguardando mais dados...";
    }
    
    const percentis = calcularTodosPercentis(todosCliques);
    
    document.getElementById("partidas").textContent = partidas;
    document.getElementById("totalCliques").textContent = totalCliques;
    document.getElementById("media").textContent = media.toFixed(2);
    document.getElementById("desvioPadrao").textContent = desvioPadrao;
    document.getElementById("diferencaTeorica").textContent = diferenca.toFixed(2);
    document.getElementById("erroPercentual").textContent = erroPercentual;
    document.getElementById("convergencia").textContent = convergencia;
    document.getElementById("p50").textContent = percentis.p50;
    document.getElementById("p75").textContent = percentis.p75;
    document.getElementById("p90").textContent = percentis.p90;
    document.getElementById("p95").textContent = percentis.p95;
    document.getElementById("p99").textContent = percentis.p99;
    document.getElementById("minimo").textContent = minimo;
    document.getElementById("maximo").textContent = maximo;
    
    // Gerar insight automático
    gerarInsight(media, erroPercentual, partidas, percentis);
    
    // Atualizar gráfico
    atualizarHistograma();
}

// Gerar insight inteligente
function gerarInsight(media, erroPercentual, partidas, percentis) {
    const insightDiv = document.getElementById("insight");
    let insight = "";
    
    if (partidas === 0) {
        insight = "💡 Aguardando dados... Realize testes para ver a análise estatística!";
    } else {
        insight = `
            <strong>📊 Análise Inteligente:</strong><br><br>
            🎯 <strong>Lei dos Grandes Números:</strong> Com ${partidas} partidas simuladas, a média observada (${media.toFixed(2)}) 
            ${Math.abs(media - MEDIA_TEORICA) < 1 ? 'está impressionantemente próxima' : 'se aproxima'} da média teórica (${MEDIA_TEORICA}), 
            com erro de apenas ${erroPercentual}%.<br><br>
            
            📐 <strong>Distribuição Geométrica:</strong> O histograma mostra uma distribuição exponencial decrescente, característica da 
            distribuição geométrica com p = ${PROBABILIDADE}. A moda está em 1 clique (${distribuicaoGeometrica(1, PROBABILIDADE) * 100}% de chance).<br><br>
            
            📊 <strong>Percentis (P90/P95):</strong> 90% das partidas terminam em até ${percentis.p90} cliques, 
            e 95% em até ${percentis.p95} cliques. Isso significa que apenas 5% das partidas exigem mais de ${percentis.p95} cliques!<br><br>
            
            ${partidas >= 1000 ? 
                `✅ <strong>Conclusão Estatística:</strong> Com ${partidas} amostras, temos confiança estatística de que o jogo segue 
                rigorosamente a distribuição geométrica teórica. O erro percentual de ${erroPercentual}% é excelente para simulações reais.` : 
                `💪 <strong>Sugestão:</strong> Realize pelo menos 1000 testes para ver a convergência completa da média.`}
        `;
    }
    
    insightDiv.innerHTML = insight;
}

// Função para simular partida (otimizada)
function simularPartida() {
    const numeroEsperadoSim = Math.floor(Math.random() * 20) + 1;
    let cliques = 0;
    let ganhouSim = false;
    
    while (!ganhouSim) {
        cliques++;
        if (Math.floor(Math.random() * 20) + 1 === numeroEsperadoSim) {
            ganhouSim = true;
        }
    }
    
    return cliques;
}

// Função para simular partidas em modo turbo (sem delays)
function simularPartidasTurbo(quantidade) {
    const novosCliques = [];
    for (let i = 0; i < quantidade; i++) {
        novosCliques.push(simularPartida());
    }
    return novosCliques;
}

// Registrar vitória manual
function registrarVitoriaManual(cliques) {
    todosCliques.push(cliques);
    atualizarEstatisticas();
    
    const statsDiv = document.createElement("div");
    statsDiv.style.background = "#e8f5e9";
    statsDiv.style.padding = "10px";
    statsDiv.style.margin = "10px 0";
    statsDiv.style.borderRadius = "5px";
    statsDiv.innerHTML = `🎯 Vitória! ${cliques} cliques. Média atual: ${(todosCliques.reduce((a,b)=>a+b,0)/todosCliques.length).toFixed(2)}`;
    document.getElementById("resultado").appendChild(statsDiv);
    
    setTimeout(() => {
        reiniciarJogoManual();
    }, 1500);
}

// Executar testes
async function executarTestes(quantidade, turbo = false) {
    if (testando) {
        alert("Já existe um teste em andamento! Espere ou pare o atual.");
        return;
    }
    
    testando = true;
    modoTurbo = turbo;
    document.getElementById("modoTeste").textContent = turbo ? "⚡ TURBO" : "Normal";
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("progressFill").textContent = "0%";
    
    const startTime = Date.now();
    let novosCliques = [];
    
    if (turbo) {
        // Modo turbo - sem atualização de UI durante o processo
        novosCliques = simularPartidasTurbo(quantidade);
        const elapsed = (Date.now() - startTime) / 1000;
        document.getElementById("testesPorSegundo").textContent = (quantidade / elapsed).toFixed(0);
        document.getElementById("progressFill").style.width = "100%";
        document.getElementById("progressFill").textContent = "100%";
    } else {
        // Modo normal - com progresso
        for (let i = 0; i < quantidade; i++) {
            if (!testando) break;
            
            const cliques = simularPartida();
            novosCliques.push(cliques);
            
            const percent = ((i + 1) / quantidade) * 100;
            document.getElementById("progressFill").style.width = percent + "%";
            document.getElementById("progressFill").textContent = Math.floor(percent) + "%";
            
            const elapsed = (Date.now() - startTime) / 1000;
            document.getElementById("testesPorSegundo").textContent = ((i + 1) / elapsed).toFixed(1);
            
            if (i % 100 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
    }
    
    if (testando) {
        todosCliques.push(...novosCliques);
        atualizarEstatisticas();
        
        const elapsed = (Date.now() - startTime) / 1000;
        const resultadoDiv = document.getElementById("estatisticas");
        resultadoDiv.innerHTML = `
            <div class="insight insight-critical" style="margin-top: 10px;">
                ✅ <strong>${turbo ? '⚡ Teste Turbo' : 'Teste'} concluído!</strong><br>
                📊 ${quantidade.toLocaleString()} partidas simuladas em ${elapsed.toFixed(2)} segundos.<br>
                ⚡ Velocidade: ${(quantidade / elapsed).toFixed(0)} partidas/segundo<br>
                📈 Média obtida: ${(novosCliques.reduce((a,b)=>a+b,0)/quantidade).toFixed(2)} cliques
            </div>
        `;
        
        setTimeout(() => {
            resultadoDiv.innerHTML = "";
        }, 5000);
    }
    
    testando = false;
}

// Atualizar histograma com curva teórica
function atualizarHistograma() {
    if (todosCliques.length === 0) return;
    
    // Calcular frequências reais
    const frequencias = {};
    todosCliques.forEach(cliques => {
        frequencias[cliques] = (frequencias[cliques] || 0) + 1;
    });
    
    const maxCliques = Math.min(100, Math.max(...todosCliques));
    const labels = [];
    const dadosReais = [];
    const dadosTeoricos = [];
    const totalPartidas = todosCliques.length;
    
    for (let i = 1; i <= maxCliques; i++) {
        labels.push(i);
        // Dados reais (frequência absoluta)
        dadosReais.push(frequencias[i] || 0);
        // Dados teóricos (probabilidade * total de partidas) - escala para comparar com frequência
        dadosTeoricos.push(distribuicaoGeometrica(i, PROBABILIDADE) * totalPartidas);
    }
    
    if (histogramaChart) {
        histogramaChart.destroy();
    }
    
    const ctx = document.getElementById('histograma').getContext('2d');
    histogramaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '📊 Distribuição Real (Frequência observada)',
                    data: dadosReais,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: '📐 Distribuição Teórica Geométrica p=0.05',
                    data: dadosTeoricos,
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de partidas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Cliques por partida'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label;
                            const value = context.raw;
                            if (context.dataset.label.includes('Teórica')) {
                                const percent = ((value / totalPartidas) * 100).toFixed(1);
                                return `${label}: ${value.toFixed(1)} partidas (${percent}%)`;
                            }
                            const percent = ((value / totalPartidas) * 100).toFixed(1);
                            return `${label}: ${value} partidas (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Modo turbo rápido (100k partidas)
function executarModoTurbo() {
    let quantidade = prompt("⚡ MODO TURBO!\nQuantas partidas deseja simular?\n(Recomendado: 100.000 - 1.000.000)", "100000");
    quantidade = parseInt(quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, insira um número válido!");
        return;
    }
    if (quantidade > 10000000) {
        if (!confirm(`${quantidade.toLocaleString()} partidas pode levar alguns segundos. Continuar?`)) {
            return;
        }
    }
    executarTestes(quantidade, true);
}

// Teste personalizado
function testePersonalizado() {
    let quantidade = prompt("Quantas partidas deseja simular?", "1000");
    quantidade = parseInt(quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, insira um número válido!");
        return;
    }
    if (quantidade > 100000) {
        if (!confirm(`${quantidade.toLocaleString()} partidas pode demorar alguns segundos. Continuar?`)) {
            return;
        }
    }
    executarTestes(quantidade, false);
}

// Parar testes
function pararTestes() {
    if (testando) {
        testando = false;
        document.getElementById("estatisticas").innerHTML = `
            <div class="insight">⏹ Teste interrompido pelo usuário.</div>
        `;
        setTimeout(() => {
            document.getElementById("estatisticas").innerHTML = "";
        }, 3000);
    }
}

// Resetar estatísticas
function resetarEstatisticas() {
    if (confirm("Tem certeza que deseja resetar todas as estatísticas?")) {
        todosCliques = [];
        atualizarEstatisticas();
        document.getElementById("estatisticas").innerHTML = "";
        document.getElementById("progressFill").style.width = "0%";
        document.getElementById("progressFill").textContent = "0%";
        document.getElementById("resultado").innerHTML = "";
        reiniciarJogoManual();
    }
}

// Exportar CSV
function exportarDados() {
    if (todosCliques.length === 0) {
        alert("Nenhum dado para exportar! Faça alguns testes primeiro.");
        return;
    }
    
    const timestamp = new Date().toISOString();
    const media = (todosCliques.reduce((a,b)=>a+b,0) / todosCliques.length).toFixed(2);
    const percentis = calcularTodosPercentis(todosCliques);
    
    let csvContent = "timestamp,partida,cliques\n";
    todosCliques.forEach((cliques, index) => {
        csvContent += `${timestamp},${index + 1},${cliques}\n`;
    });
    
    csvContent += "\n# Estatisticas Gerais\n";
    csvContent += `timestamp,${timestamp}\n`;
    csvContent += `total_partidas,${todosCliques.length}\n`;
    csvContent += `total_cliques,${todosCliques.reduce((a,b)=>a+b,0)}\n`;
    csvContent += `media,${media}\n`;
    csvContent += `media_teorica,${MEDIA_TEORICA}\n`;
    csvContent += `erro_percentual,${(Math.abs(media - MEDIA_TEORICA) / MEDIA_TEORICA * 100).toFixed(2)}%\n`;
    csvContent += `desvio_padrao,${calcularDesvioPadrao(todosCliques)}\n`;
    csvContent += `minimo,${Math.min(...todosCliques)}\n`;
    csvContent += `maximo,${Math.max(...todosCliques)}\n`;
    csvContent += `p50,${percentis.p50}\n`;
    csvContent += `p75,${percentis.p75}\n`;
    csvContent += `p90,${percentis.p90}\n`;
    csvContent += `p95,${percentis.p95}\n`;
    csvContent += `p99,${percentis.p99}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `joguinho_estatisticas_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Exportar JSON
function exportarJSON() {
    if (todosCliques.length === 0) {
        alert("Nenhum dado para exportar! Faça alguns testes primeiro.");
        return;
    }
    
    const media = (todosCliques.reduce((a,b)=>a+b,0) / todosCliques.length).toFixed(2);
    const percentis = calcularTodosPercentis(todosCliques);
    
    const dados = {
        metadata: {
            timestamp: new Date().toISOString(),
            media_teorica: MEDIA_TEORICA,
            probabilidade: PROBABILIDADE,
            total_testes: todosCliques.length
        },
        dados_brutos: todosCliques,
        estatisticas: {
            media: parseFloat(media),
            desvio_padrao: parseFloat(calcularDesvioPadrao(todosCliques)),
            minimo: Math.min(...todosCliques),
            maximo: Math.max(...todosCliques),
            p50: percentis.p50,
            p75: percentis.p75,
            p90: percentis.p90,
            p95: percentis.p95,
            p99: percentis.p99
        }
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `joguinho_dados_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Event Listeners
document.getElementById("test10").addEventListener("click", () => executarTestes(10, false));
document.getElementById("test100").addEventListener("click", () => executarTestes(100, false));
document.getElementById("test1000").addEventListener("click", () => executarTestes(1000, false));
document.getElementById("test10000").addEventListener("click", () => executarTestes(10000, false));
document.getElementById("testTurbo").addEventListener("click", executarModoTurbo);
document.getElementById("testCustom").addEventListener("click", testePersonalizado);
document.getElementById("stopTest").addEventListener("click", pararTestes);
document.getElementById("resetStats").addEventListener("click", resetarEstatisticas);
document.getElementById("exportData").addEventListener("click", exportarDados);
document.getElementById("exportJSON").addEventListener("click", exportarJSON);

// Inicializar
atualizarEstatisticas();

console.log("✅ Sistema de testes avançado carregado!");
console.log("🎯 Comparação teórica ativada!");
console.log("⚡ Modo Turbo disponível (100k+ partidas instantâneas)!");
console.log("📊 Curva teórica sobreposta no gráfico!");