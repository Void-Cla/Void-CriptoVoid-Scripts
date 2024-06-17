// ==UserScript==
// @name          Multiply BTC Tabela
// @namespace     https://void-cla.github.io/criptovoid/
// @version       1.0
// @description   Este script monitora e exibe estatísticas detalhadas das rolagens no jogo Multiply BTC do Freebitco.in.
// @author        Sr.fox
// @match         https://freebitco.in/*
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Status: Multiply BTC Tabela");

    // Contador global de rolagens
    let numRolls = 0;
    // Elemento HTML para exibir o número de rolagens
    let numRollsTd = document.createElement('td');

    // Estrutura de estatísticas por intervalo de odds
    const stat = {
        4: { 'hi': 7625, 'lo': 2375, 'miss_hi': 0, 'miss_lo': 0 },
        8: { 'hi': 8813, 'lo': 1188, 'miss_hi': 0, 'miss_lo': 0 },
        19: { 'hi': 9500, 'lo': 500, 'miss_hi': 0, 'miss_lo': 0 },
        34: { 'hi': 9721, 'lo': 279, 'miss_hi': 0, 'miss_lo': 0 },
        64: { 'hi': 9852, 'lo': 148, 'miss_hi': 0, 'miss_lo': 0 },
        128: { 'hi': 9926, 'lo': 74, 'miss_hi': 0, 'miss_lo': 0 },
        256: { 'hi': 9963, 'lo': 37, 'miss_hi': 0, 'miss_lo': 0 },
        512: { 'hi': 9981, 'lo': 19, 'miss_hi': 0, 'miss_lo': 0 },
        1250: { 'hi': 9992, 'lo': 8, 'miss_hi': 0, 'miss_lo': 0 },
        2000: { 'hi': 9995, 'lo': 5, 'miss_hi': 0, 'miss_lo': 0 },
        4750: { 'hi': 9998, 'lo': 2, 'miss_hi': 0, 'miss_lo': 0 },
        8888: { 'hi': 0, 'lo': 0, 'miss_hi': 0, 'miss_lo': 0 }
    };

    // Criação do elemento de interface fixa na página
    let div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:50px;left:0;background-color:white;padding:10px;border:1px solid #ccc;z-index:9999;';

    // Função para criar as linhas de cabeçalho na tabela
    function tableHeaderRows() {
        // Linha do título
        let titleTr = document.createElement('tr');
        let titleTh = document.createElement('th');
        titleTh.colSpan = 6; // Número total de colunas na tabela
        titleTh.style.cssText = 'text-align: center;'; // Centraliza o texto
        titleTh.innerHTML = '<strong>Multiply BTC Tabela</strong>';
        titleTr.appendChild(titleTh);

        // Linha de cabeçalhos
        let headerTr = document.createElement('tr');
        headerTr.innerHTML = '<th>Odds</th><th>HI</th><th>LO</th><th>HI</th><th>LO</th>';

        return [titleTr, headerTr];
    }

    // Função para criar a linha de rolagens na tabela
    function tableRollsRow() {
        let tr = document.createElement('tr');
        let tdLabel = document.createElement('td');
        let boldLabel = document.createElement('strong');
        boldLabel.textContent = 'Rolagens';
        tdLabel.appendChild(boldLabel);

        // Células vazias para alinhamento
        tr.appendChild(tdLabel);
        tr.appendChild(document.createElement('td'));
        tr.appendChild(numRollsTd);
        return tr;
    }

    // Função para criar a linha de resultado provável na tabela
    function tableProbableResultRow() {
        let tr = document.createElement('tr');
        tr.id = 'probable-result-row'; // Atribui um ID para fácil acesso

        let tdLabel = document.createElement('td');
        tdLabel.colSpan = 6; // Número total de colunas na tabela
        tdLabel.style.cssText = 'text-align: center;'; // Centraliza o texto
        tdLabel.innerHTML = '<strong>Provavelmente será: </strong><span id="probable-result">N/A</span>';

        tr.appendChild(tdLabel);
        return tr;
    }

    // Criação da tabela para exibir estatísticas
    let table = document.createElement('table');

    // Obtenção das linhas de cabeçalho
    let headerRows = tableHeaderRows();
    table.appendChild(headerRows[0]); // Adiciona a linha do título
    table.appendChild(headerRows[1]); // Adiciona a linha de cabeçalhos

    // Adiciona linhas para cada intervalo de odds com suas estatísticas
    for (let betLabel in stat) {
        let tr = document.createElement('tr');

        let tdLabel = document.createElement('td');
        tdLabel.textContent = betLabel;

        let tdHi = document.createElement('td');
        tdHi.textContent = stat[betLabel]['hi'];

        let tdLo = document.createElement('td');
        tdLo.textContent = stat[betLabel]['lo'];

        let tdMissHi = document.createElement('td');
        tdMissHi.textContent = stat[betLabel]['miss_hi'];

        let tdMissLo = document.createElement('td');
        tdMissLo.textContent = stat[betLabel]['miss_lo'];

        // Atribui IDs para cada célula de estatística para atualização dinâmica
        tdMissHi.id = 'stat-' + betLabel + '-miss-hi';
        tdMissLo.id = 'stat-' + betLabel + '-miss-lo';

        tr.appendChild(tdLabel);
        tr.appendChild(tdHi);
        tr.appendChild(tdLo);
        tr.appendChild(tdMissHi);
        tr.appendChild(tdMissLo);

        table.appendChild(tr);
    }

    // Adiciona a linha de resultado provável
    table.appendChild(tableProbableResultRow());

    // Adiciona a tabela ao elemento de interface
    div.appendChild(table);
    // Adiciona o elemento de interface ao documento
    document.documentElement.appendChild(div);

    // Função para calcular o resultado mais provável
    function calculateProbableResult() {
        let probableResult = 'N/A'; // Valor padrão
        let minMissHi = Infinity;
        let minMissLo = Infinity;

        for (let betLabel in stat) {
            if (stat[betLabel]['miss_hi'] < minMissHi) {
                minMissHi = stat[betLabel]['miss_hi'];
                probableResult = `HI ${betLabel}`;
            }
            if (stat[betLabel]['miss_lo'] < minMissLo) {
                minMissLo = stat[betLabel]['miss_lo'];
                probableResult = `LO ${betLabel}`;
            }
        }

        return probableResult;
    }

    // Função para redesenhar as estatísticas na tabela
    function redraw() {
        numRollsTd.textContent = numRolls;

        for (let betLabel in stat) {
            document.getElementById('stat-' + betLabel + '-miss-hi').textContent = stat[betLabel]['miss_hi'];
            document.getElementById('stat-' + betLabel + '-miss-lo').textContent = stat[betLabel]['miss_lo'];
        }

        // Atualiza o resultado mais provável
        document.getElementById('probable-result').textContent = calculateProbableResult();
    }

    // Obtém o elemento onde a tabela de histórico de apostas é atualizada
    let table_rows = document.getElementById('bet_history_table_rows');

    // Cria um array para armazenar todas as rolagens
    let rolls = [];

    // Cria um observador de mutação para monitorar a tabela de histórico de apostas
    let observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            for (let addedNode of mutation.addedNodes) {
                if (addedNode.className == 'multiply_bet_history_table_row') {
                    // Obtém a rolagem adicionada
                    let roll = parseInt(addedNode.firstChild.childNodes[3].textContent);

                    // Verifica se a rolagem está dentro do intervalo válido
                    if (!isNaN(roll) && roll >= 0 && roll <= 10000) {
                        numRolls++;

                        // Atualiza as estatísticas para cada intervalo de odds
                        for (let betLabel in stat) {
                            if (betLabel == 8888) {
                                if (roll == 8888) {
                                    stat[betLabel]['miss_hi'] = 0;
                                    stat[betLabel]['miss_lo'] = 0;
                                } else {
                                    stat[betLabel]['miss_hi']++;
                                    stat[betLabel]['miss_lo']++;
                                }
                                continue;
                            }

                            // Atualiza miss_hi e miss_lo com base na rolagem
                            if (roll > stat[betLabel]['hi']) {
                                stat[betLabel]['miss_hi'] = 0;
                            } else {
                                stat[betLabel]['miss_hi']++;
                            }

                            if (roll < stat[betLabel]['lo']) {
                                stat[betLabel]['miss_lo'] = 0;
                            } else {
                                stat[betLabel]['miss_lo']++;
                            }
                        }
                    } else {
                        console.error('Rolagem inválida:', roll);
                    }
                }
            }
        }

        // Redesenha a tabela de estatísticas após a atualização
        redraw();
    });

    // Configuração do observador para observar mudanças na tabela de histórico de apostas
    let config = {
        childList: true
    };

    // Inicia a observação
    observer.observe(table_rows, config);
})();
